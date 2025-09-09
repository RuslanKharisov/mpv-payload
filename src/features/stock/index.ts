import type { Currency, Manufacturer, Media, Product, Stock, Tenant } from '@/payload-types'
import { WithPopulated, WithPopulatedMany } from '@/shared/utilities/payload-types-extender'

export type StockWithTenantAndCurrency = WithPopulatedMany<
  Stock,
  {
    tenant: Tenant
    currency: Currency
    product: WithPopulatedMany<
      Product,
      {
        productImage: Media
        manufacturer: Manufacturer
      }
    >
  }
>

type NormalizedStock = {
  supplier: {
    id: string | number
    name: string
  }
  quantity: number
  price: number
  currency: {
    code: string
    symbol?: string | null
    name: string
  } | null
  updatedAt: string | null
}

export function normalizeStockRow(row: StockWithTenantAndCurrency): NormalizedStock {
  const supplier =
    typeof row.tenant === 'number' || typeof row.tenant === 'string'
      ? { id: row.tenant, name: '' }
      : { id: row.tenant?.id ?? '', name: row.tenant?.name ?? '' }

  const currency =
    typeof row.currency === 'number' || typeof row.currency === 'string'
      ? null
      : row.currency
        ? {
            code: row.currency.code,
            symbol: row.currency.symbol,
            name: row.currency.name,
          }
        : null

  return {
    supplier,
    quantity: row.quantity ?? 0,
    price: row.price ?? 0,
    currency,
    updatedAt: row.updatedAt ?? null,
  }
}
