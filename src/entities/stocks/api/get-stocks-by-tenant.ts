'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Currency, Product, Stock, User, Warehouse } from '@/payload-types'

type PopulatedStock = Stock & {
  product: Product
  warehouse?: Warehouse | null
  currency: Currency
}

export async function getStocksByTenant(
  params: { page: number; perPage: number },
  user?: User | null,
): Promise<{
  data: Stock[]
  total: number
  page: number
  perPage: number
}> {
  // Get tenantId from user's first tenant
  const firstTenant = user?.tenants?.[0]
  if (!firstTenant) {
    return { data: [], total: 0, page: params.page, perPage: params.perPage }
  }

  const tenantId =
    typeof firstTenant.tenant === 'object' ? firstTenant.tenant.id : firstTenant.tenant

  if (!tenantId) {
    return { data: [], total: 0, page: params.page, perPage: params.perPage }
  }

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'stocks',
    where: {
      tenant: {
        equals: tenantId,
      },
    },
    depth: 2,
    page: params.page,
    limit: params.perPage,
  })

  return {
    data: result.docs as PopulatedStock[],
    total: result.totalDocs,
    page: params.page,
    perPage: params.perPage,
  }
}
