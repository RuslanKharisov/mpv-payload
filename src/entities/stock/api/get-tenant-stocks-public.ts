'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Stock } from '@/payload-types'

interface GetTenantStocksPublicInput {
  tenantId: number | string
  page?: number
  perPage?: number
  filters?: {
    sku?: string
    description?: string
  }
}

interface GetTenantStocksPublicOutput {
  docs: Stock[]
  totalDocs: number
  totalPages: number
  page: number
}

export async function getTenantStocksPublic({
  tenantId,
  page = 1,
  perPage = 20,
  filters,
}: GetTenantStocksPublicInput): Promise<GetTenantStocksPublicOutput> {
  const payload = await getPayload({ config: configPromise })

  try {
    const where: Record<string, any> = {
      tenant: { equals: tenantId },
    }

    if (filters?.sku) {
      where['product.sku'] = { like: filters.sku }
    }

    if (filters?.description) {
      // можно искать по name/shortDescription одновременно через or
      where.or = [
        { 'product.name': { like: filters.description } },
        { 'product.shortDescription': { like: filters.description } },
      ]
    }

    const result = await payload.find({
      collection: 'stocks',
      where,
      limit: perPage,
      page,
      depth: 2,
    })

    return {
      docs: result.docs as Stock[],
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page ?? 1,
    }
  } catch (error) {
    console.error('Error fetching tenant stocks:', error)
    return {
      docs: [],
      totalDocs: 0,
      totalPages: 0,
      page: 1,
    }
  }
}
