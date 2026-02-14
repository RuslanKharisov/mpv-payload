import { z } from 'zod'
import { Tenant } from '@/payload-types'

// Zod schema for runtime validation of RemoteStock
// Only sku, description, and quantity are required - other fields are optional
// to accommodate varying external API responses
export const RemoteStockSchema = z.object({
  // Required fields
  sku: z.string(),
  description: z.string(),
  quantity: z.number(),
  // Optional fields - external API may not provide these
  id: z.string().optional(),
  name: z.string().optional(),
  supplier: z.string().optional(),
  supplierId: z.number().optional(),
  email: z.string().optional(),
  siteUrl: z.string().nullable().optional(),
  newDeliveryQty1: z.number().optional(),
  newDeliveryDate1: z.iso.datetime().or(z.date()).optional(),
  newDeliveryQty2: z.number().optional(),
  newDeliveryDate2: z.iso.datetime().or(z.date()).optional(),
  brand: z.string().optional(),
  price: z.number().optional(),
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
