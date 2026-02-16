'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getMeUser } from '@/shared/utilities/getMeUser'
import type { Stock } from '@/payload-types'
import { StockWithRelations } from '../model/stock-with-relations'

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
  const page = Math.max(1, Math.floor(params.page) || 1)
  const perPage = Math.min(100, Math.max(1, Math.floor(params.perPage) || 20))
  const tenantId = params.tenantId

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
