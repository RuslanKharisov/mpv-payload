import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getMeUser } from '@/shared/utilities/getMeUser'
import { getActiveTenantId, tenantHasActiveFeature } from '@/payload/access/hasActiveFeature'
import type { User, Tenant } from '@/payload-types'

export interface SupplierDashboardSummary {
  user: User
  tenant: Tenant
  warehousesCount: number
  stocksCount: number
  skuCount: number
  warehousesWithStock: number
  warehousesSample: {
    id: string
    title: string
    address?: string
  }[]
  subscription?: {
    id: string
    status: 'active' | 'inactive' | 'canceled' | 'expired' | string
    endDate?: string
    tariffName?: string
    features?: string[]
  } | null
  canManageStock: boolean
}

export async function getSupplierDashboardSummary(): Promise<SupplierDashboardSummary | null> {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  if (!user) {
    return null
  }

  const activeTenantId = getActiveTenantId(user)
  if (!activeTenantId) {
    return null
  }

  const payload = await getPayload({ config: configPromise })

  // Fetch tenant data
  let tenant: Tenant
  try {
    tenant = await payload.findByID({
      collection: 'tenants',
      id: activeTenantId,
    })
  } catch {
    return null
  }

  // Fetch warehouses for the tenant
  const warehousesResult = await payload.find({
    collection: 'warehouses',
    where: {
      tenant: {
        equals: activeTenantId,
      },
    },
    depth: 1,
  })

  const warehousesCount = warehousesResult.totalDocs

  // Get sample of warehouses (first 5)
  const warehousesSample = warehousesResult.docs.slice(0, 5).map((doc) => {
    const address =
      typeof doc.warehouse_address === 'object' && doc.warehouse_address !== null
        ? (doc.warehouse_address.fullAddress ?? '')
        : ''

    return {
      id: String(doc.id),
      title: doc.title,
      address,
    }
  })

  // Fetch stocks for the tenant
  const stocksResult = await payload.find({
    collection: 'stocks',
    where: {
      tenant: {
        equals: activeTenantId,
      },
    },
    depth: 0,
    limit: 0,
  })

  const stocksCount = stocksResult.totalDocs

  // Calculate unique SKU count from stocks
  const uniqueProductIds = new Set<number>()
  const uniqueWarehouseIds = new Set<number>()

  for (const stock of stocksResult.docs) {
    // Product can be number or object, we only need the ID
    const productId = typeof stock.product === 'number' ? stock.product : stock.product?.id
    if (productId) {
      uniqueProductIds.add(productId)
    }

    // Warehouse can be number, object, or null
    if (stock.warehouse) {
      const warehouseId = typeof stock.warehouse === 'number' ? stock.warehouse : stock.warehouse.id
      if (warehouseId) {
        uniqueWarehouseIds.add(warehouseId)
      }
    }
  }

  const skuCount = uniqueProductIds.size
  const warehousesWithStock = uniqueWarehouseIds.size

  // Check if user is super-admin
  const isSuperAdmin = user.roles?.includes('super-admin') ?? false

  // Check CAN_MANAGE_STOCK feature
  const canManageStock = isSuperAdmin
    ? true
    : await tenantHasActiveFeature(activeTenantId, 'CAN_MANAGE_STOCK', payload)

  // Fetch active subscription for the tenant
  let subscription: SupplierDashboardSummary['subscription'] = null
  try {
    const subscriptionsResult = await payload.find({
      collection: 'subscriptions',
      where: {
        tenant: { equals: activeTenantId },
        status: { equals: 'active' },
        endDate: { greater_than_equal: new Date().toISOString() },
      },
      depth: 1,
    })

    if (subscriptionsResult.docs.length > 0) {
      const activeSubscription = subscriptionsResult.docs[0]
      const tariff = activeSubscription.tariff

      subscription = {
        id: String(activeSubscription.id),
        status: activeSubscription.status ?? 'active',
        endDate: activeSubscription.endDate ?? undefined,
        tariffName: typeof tariff === 'object' && tariff !== null ? tariff.name : undefined,
        features: typeof tariff === 'object' && tariff !== null ? (tariff.features ?? []) : [],
      }
    }
  } catch (error) {
    console.error('Error fetching subscription:', error)
  }

  return {
    user,
    tenant,
    warehousesCount,
    stocksCount,
    skuCount,
    warehousesWithStock,
    warehousesSample,
    subscription,
    canManageStock,
  }
}
