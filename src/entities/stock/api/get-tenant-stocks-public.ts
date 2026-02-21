'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Stock } from '@/payload-types'

interface GetTenantStocksPublicInput {
  tenantId: number | string
  page?: number
  perPage?: number
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
}: GetTenantStocksPublicInput): Promise<GetTenantStocksPublicOutput> {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'stocks',
      where: {
        tenant: { equals: tenantId },
      },
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
