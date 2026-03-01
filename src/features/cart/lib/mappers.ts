import { NormalizedCartItem } from '@/entities/cart'
import { RemoteStock } from '@/entities/remote-stock'
import { StockWithTenantAndCurrency } from '@/features/stock'
import { Tenant } from '@/payload-types'

const PLACEHOLDER_IMAGE_URL = '/images/placeholder.webp'

// Адаптер для локального склада (из Payload)
export function mapLocalStockToCartItem(stock: StockWithTenantAndCurrency): NormalizedCartItem {
  return {
    id: stock.id.toString(), // ID из базы данных Payload уникален
    sku: stock.product.sku,
    description: stock.product?.shortDescription ?? '',
    imageUrl: stock.product.productImage.url || PLACEHOLDER_IMAGE_URL,
    brand: stock.product.brand?.name,
    supplierName: stock.tenant.name,
    supplierEmail: stock.tenant.requestEmail,
    price: stock.price ?? 0,
    currencyCode: stock.currency.code,
    availableQuantity: stock.quantity,
    originalItem: stock,
    source: 'local',
  }
}

// Адаптер для удаленного склада
// `supplier` передается отдельно, т.к. `remoteStock` его не содержит

function getWarehouseCityFromTenant(tenant: Tenant): string | undefined {
  if (!tenant.warehouse || typeof tenant.warehouse !== 'object') return undefined

  const address = tenant.warehouse.warehouse_address
  if (!address || typeof address !== 'object') return undefined

  return 'city' in address ? address.city || undefined : undefined
}

export function mapRemoteStockToCartItem(
  remoteStock: RemoteStock, // Тип для одного элемента из `data`
  supplier: Tenant,
): NormalizedCartItem {
  // Генерация стабильного уникального ID. Комбинация ID поставщика и SKU.
  const uniqueId = `remote-${supplier.id}-${remoteStock.sku}`

  return {
    id: uniqueId,
    sku: remoteStock.sku,
    description: remoteStock.description,
    imageUrl: PLACEHOLDER_IMAGE_URL,
    brand: remoteStock.brand || undefined,
    supplierName: supplier.name,
    supplierEmail: supplier.requestEmail,
    price: remoteStock.price ?? 0,
    currencyCode: 'RUB',
    availableQuantity: remoteStock.quantity,
    originalItem: { ...remoteStock, supplierId: supplier.id },
    source: 'remote',
    warehouse: getWarehouseCityFromTenant(supplier),
  }
}
