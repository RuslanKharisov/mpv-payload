import type {
  SupplierDashboardSummary,
  SupplierDashboardTenant,
  SupplierDashboardUser,
} from '../../model/types'
import type { Payload } from 'payload'
import type { Tenant, User } from '@/payload-types'
import { getActiveTenantId } from '@/payload/access/hasActiveFeature'
import { isSuperAdmin } from '@/payload/access/isSuperAdmin'

interface GetSummaryDeps {
  payload: Payload
  user: User
}

export async function getSupplierDashboardSummaryServer(
  deps: GetSummaryDeps,
): Promise<SupplierDashboardSummary | null> {
  const { payload, user } = deps

  const activeTenantId = getActiveTenantId(user)
  if (!activeTenantId) return null

  let tenant: Tenant
  try {
    tenant = await payload.findByID({
      collection: 'tenants',
      id: activeTenantId,
    })
  } catch {
    return null
  }

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

  let stocksCount = 0
  let hasStockError = false
  let skuCount = 0
  let warehousesWithStock = 0

  try {
    const stocksCountResult = await payload.find({
      collection: 'stocks',
      where: { tenant: { equals: activeTenantId } },
      depth: 0,
      limit: 1,
      pagination: true,
    })
    stocksCount = stocksCountResult.totalDocs

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
        const productId = typeof stock.product === 'number' ? stock.product : stock.product?.id
        if (productId) {
          uniqueProductIds.add(productId)
        }

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

  const userIsSuperAdmin = isSuperAdmin(user)

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

  const needsCompanyCompletion = !tenant.inn || tenant.accountDetailsSubmitted === false

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
    needsCompanyCompletion,
  }
}
