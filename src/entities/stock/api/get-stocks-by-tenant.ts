'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { StockWithRelations } from '../model/stock-with-relations'
import { getMeUser } from '@/shared/utilities/getMeUser'

export interface GetStocksByTenantParams {
  page: number
  perPage: number
  tenantId?: string | number | null
}

export async function getStocksByTenant(params: GetStocksByTenantParams): Promise<{
  data: StockWithRelations[]
  total: number
  page: number
  perPage: number
}> {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  if (!user) {
    return { data: [], total: 0, page: params.page, perPage: params.perPage }
  }

  const page = Math.max(1, Math.floor(params.page) || 1)
  const perPage = Math.min(100, Math.max(1, Math.floor(params.perPage) || 5))
  const tenantId = params.tenantId

  if (!tenantId) {
    return { data: [], total: 0, page, perPage }
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
    page: page,
    limit: perPage,
  })

  return {
    data: result.docs as StockWithRelations[],
    total: result.totalDocs,
    page: page,
    perPage: perPage,
  }
}
