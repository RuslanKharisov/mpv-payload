import { z } from 'zod'
import { Tenant } from '@/payload-types'

/**
 * Helper to parse optional numeric fields from external API.
 * External API may return numbers as strings, null, undefined, or empty strings.
 * This transformer converts empty/null/undefined to null, and parses strings to numbers.
 */
const optionalNumberFromApi = z
  .union([z.number(), z.string(), z.null(), z.undefined()])
  .transform((v) => {
    if (v === '' || v === undefined || v === null) return null
    return typeof v === 'string' ? Number(v) : v
  })

// Zod schema for runtime validation of RemoteStock
// Only sku, description, and quantity are required - other fields are optional
// to accommodate varying external API responses
export const RemoteStockSchema = z.object({
  // Required fields
  sku: z.string(),
  description: z.string(),
  quantity: z.coerce.number(),
  // Optional fields - external API may not provide these
  id: z.string().optional(),
  name: z.string().optional(),
  supplier: z.string().optional(),
  supplierId: optionalNumberFromApi.optional(),
  email: z.string().optional(),
  siteUrl: z.string().nullable().optional(),
  newDeliveryQty1: optionalNumberFromApi.optional(),
  newDeliveryDate1: z.iso.datetime().or(z.date()).optional(),
  newDeliveryQty2: optionalNumberFromApi.optional(),
  newDeliveryDate2: z.iso.datetime().or(z.date()).optional(),
  brand: z.string().optional(),
  price: optionalNumberFromApi.optional(),
})

// Zod schema for runtime validation of StockResponse
export const StockResponseSchema = z.object({
  data: z.array(RemoteStockSchema),
  meta: z.object({
    page: z.number(),
    per_page: z.number(),
    total: z.number(),
    total_pages: z.number(),
    sort_order: z.string(),
  }),
})

// Type inferred from schema
export type RemoteStock = z.infer<typeof RemoteStockSchema>
export type StockResponse = z.infer<typeof StockResponseSchema>

export type SupplierStock = {
  supplier: Tenant
  data: RemoteStock[]
  meta: StockResponse['meta']
}
