import type { Tenant } from '@/payload-types'
import { getActiveTenantId } from '@/payload/access/hasActiveFeature'
import { isSuperAdmin } from '@/payload/access/isSuperAdmin'
import { getMeUser } from '@/shared/utilities/getMeUser'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

// Безопасный интерфейс пользователя (без чувствительных полей)
export interface SupplierDashboardUser {
  id: string
  name: string
  email: string
  roles?: ('user' | 'admin' | 'super-admin' | 'content-editor')[]
}

// Безопасный интерфейс тенанта (без чувствительных полей)
export interface SupplierDashboardTenant {
  id: string
  name: string
  slug?: string | null
  domain?: string | null
  requestEmail: string
  createdAt: string
}

export interface SupplierDashboardSummary {
  user: SupplierDashboardUser
  tenant: SupplierDashboardTenant
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
  hasStockError?: boolean
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
  let warehousesResult
  try {
    warehousesResult = await payload.find({
      collection: 'warehouses',
      where: {
        tenant: {
          equals: activeTenantId,
        },
      },
      depth: 1,
    })
  } catch (error) {
    console.error('Error fetching warehouses:', error)
    warehousesResult = { totalDocs: 0, docs: [] }
  }

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
  let stocksCount = 0
  let hasStockError = false
  let skuCount = 0
  let warehousesWithStock = 0

  try {
    // Get total count only (limit: 1, we only need totalDocs)
    const stocksCountResult = await payload.find({
      collection: 'stocks',
      where: { tenant: { equals: activeTenantId } },
      depth: 0,
      limit: 1,
      pagination: true,
    })
    stocksCount = stocksCountResult.totalDocs

    // Fetch only product and warehouse IDs with pagination to avoid OOM
    // Process in chunks to compute unique counts
    const uniqueProductIds = new Set<number>()
    const uniqueWarehouseIds = new Set<number>()
    const BATCH_SIZE = 1000
    let page = 1
    let hasMore = true

    while (hasMore && !hasStockError) {
      const batchResult = await payload.find({
        collection: 'stocks',
        where: { tenant: { equals: activeTenantId } },
        depth: 0,
        limit: BATCH_SIZE,
        page,
        select: {
          product: true,
          warehouse: true,
        },
      })

      for (const stock of batchResult.docs) {
        // Product can be number or object, we only need the ID
        const productId = typeof stock.product === 'number' ? stock.product : stock.product?.id
        if (productId) {
          uniqueProductIds.add(productId)
        }

        // Warehouse can be number, object, or null
        if (stock.warehouse) {
          const warehouseId =
            typeof stock.warehouse === 'number' ? stock.warehouse : stock.warehouse.id
          if (warehouseId) {
            uniqueWarehouseIds.add(warehouseId)
          }
        }
      }

      hasMore = batchResult.hasNextPage
      page++

      // Safety limit to prevent infinite loops
      if (page > 1000) {
        console.warn('Stock pagination safety limit reached')
        break
      }
    }

    skuCount = uniqueProductIds.size
    warehousesWithStock = uniqueWarehouseIds.size
  } catch (error) {
    console.error('Error fetching stocks:', error)
    hasStockError = true
    stocksCount = 0
    skuCount = 0
    warehousesWithStock = 0
  }

  // Check if user is super-admin using shared utility
  const userIsSuperAdmin = isSuperAdmin(user)

  // Fetch active subscription for the tenant (single query)
  let subscription: SupplierDashboardSummary['subscription'] = null
  let canManageStock = userIsSuperAdmin

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

      // Derive canManageStock from subscription if not super-admin
      if (!userIsSuperAdmin) {
        canManageStock =
          typeof tariff === 'object' &&
          tariff !== null &&
          Array.isArray(tariff.features) &&
          tariff.features.includes('CAN_MANAGE_STOCK')
      }
    }
  } catch (error) {
    console.error('Error fetching subscription:', error)
  }

  // Фильтруем чувствительные поля перед возвратом
  const safeUser: SupplierDashboardUser = {
    id: String(user.id),
    name: user.username,
    email: user.email,
    roles: user.roles ?? undefined,
  }

  const safeTenant: SupplierDashboardTenant = {
    id: String(tenant.id),
    name: tenant.name,
    slug: tenant.slug,
    domain: tenant.domain,
    requestEmail: tenant.requestEmail,
    createdAt: tenant.createdAt,
  }

  return {
    user: safeUser,
    tenant: safeTenant,
    warehousesCount,
    stocksCount,
    skuCount,
    warehousesWithStock,
    warehousesSample,
    subscription,
    canManageStock,
    hasStockError,
  }
}
