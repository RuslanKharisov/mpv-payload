'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { StockWithRelations } from '../model/stock-with-relations'

export async function getStocksByTenant(
  params: { page: number; perPage: number },
  tenantId?: string | number | null,
): Promise<{
  data: StockWithRelations[]
  total: number
  page: number
  perPage: number
}> {
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
    depth: 2, // Ensures product, currency, and warehouse are populated objects, not IDs
    page: params.page,
    limit: params.perPage,
  })

  // Validate that depth: 2 correctly populated relations (product and currency are required)
  // If relations are not populated (e.g., due to access control or data issues), filter them out
  const validatedDocs = result.docs.filter((doc): doc is StockWithRelations => {
    const hasProduct = typeof doc.product === 'object' && doc.product !== null
    const hasCurrency = typeof doc.currency === 'object' && doc.currency !== null
    if (!hasProduct || !hasCurrency) {
      console.warn(
        `[getStocksByTenant] Skipping stock ${doc.id}: missing populated relations (product: ${hasProduct}, currency: ${hasCurrency})`,
      )
      return false
    }
    return true
  })

  return {
    data: validatedDocs,
    total: validatedDocs.length,
    page: params.page,
    perPage: params.perPage,
  }
}
