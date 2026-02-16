'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getMeUser } from '@/shared/utilities/getMeUser'
import type { Stock } from '@/payload-types'
import { StockWithRelations } from '../model/stock-with-relations'

export async function getStocksByTenant(params: { page: number; perPage: number }): Promise<{
  data: StockWithRelations[]
  total: number
  page: number
  perPage: number
}> {
  const { user } = await getMeUser()

  if (!user) {
    throw new Error('UNAUTHORIZED')
  }

  // Get tenantId from user's first tenant
  const firstTenant = user.tenants?.[0]
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
    data: result.docs as StockWithRelations[],
    total: result.totalDocs,
    page: params.page,
    perPage: params.perPage,
  }
}
