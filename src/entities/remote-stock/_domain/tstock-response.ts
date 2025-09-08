import { Tenant } from '@/payload-types'

export type StockResponse = {
  data: any[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
    sort_order: string
  }
}

export type SupplierStock = {
  supplier: Tenant
  data: StockResponse['data']
  meta: StockResponse['meta']
}
