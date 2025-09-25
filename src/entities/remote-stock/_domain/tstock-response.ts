import { Tenant } from '@/payload-types'
import { RemoteStock } from './remote-stock'

export type StockResponse = {
  data: RemoteStock[]
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
  data: RemoteStock[]
  meta: StockResponse['meta']
}
