import { CartEntry } from '@/entities/cart'
import { PriceRequestItem } from '@/entities/price-request'

function mapCartEntryToPriceRequestItem(entry: CartEntry): PriceRequestItem {
  const { item, quantity } = entry

  return {
    item: {
      id: item.id,
      sku: item.sku,
      description: item.description ?? '',
      supplierName: item.supplierName,
      currencyCode: item.currencyCode,
    },
    quantity,
  }
}

export { mapCartEntryToPriceRequestItem }
