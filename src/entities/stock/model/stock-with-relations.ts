import type { Stock, Product, Warehouse, Currency } from '@/payload-types'

export type StockWithRelations = Stock & {
  product: Product
  warehouse?: Warehouse | null
  currency: Currency
}
