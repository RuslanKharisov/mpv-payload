import { CartEntry } from '@/entities/cart'

export interface SendPriceRequestModalProps {
  tenantName: string
  items: CartEntry[]
  trigger?: React.ReactNode
}
