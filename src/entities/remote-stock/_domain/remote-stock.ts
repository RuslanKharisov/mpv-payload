import { Address, Warehouse } from '@/payload-types'
import { WithPopulatedMany } from '@/shared/utilities/payload-types-extender'

export type RemoteStock = {
  id: string
  sku: string
  name?: string
  description: string
  quantity: number
  supplier: string
  supplierId: number
  email: string
  siteUrl: string | null
  newDeliveryQty1: number
  newDeliveryDate1: Date
  newDeliveryQty2: number
  newDeliveryDate2: Date
  brand: string
  price: number
}
