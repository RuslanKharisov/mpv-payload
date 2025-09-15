import { StockWithTenantAndCurrency } from '@/features/stock'
import { Tenant } from '@/payload-types'
import { RemoteStock } from '@/entities/remote-stock'
import { NormalizedCartItem } from '@/entities/cart'

const PLACEHOLDER_IMAGE_URL = '/images/placeholder.webp'

// Адаптер для локального склада (из Payload)
export function mapLocalStockToCartItem(stock: StockWithTenantAndCurrency): NormalizedCartItem {
  return {
    id: stock.id.toString(), // ID из базы данных Payload уникален
    sku: stock.product.sku,
    description: stock.product?.shortDescription ?? '', // Уточните, где у вас описание
    imageUrl: stock.product.productImage.url || PLACEHOLDER_IMAGE_URL,
    manufacturer: stock.product.manufacturer?.name,
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
// Обратите внимание: `supplier` передается отдельно, т.к. сам `remoteStock` его не содержит
export function mapRemoteStockToCartItem(
  remoteStock: RemoteStock, // Тип для одного элемента из `data`
  supplier: Tenant,
): NormalizedCartItem {
  // Генерируем стабильный уникальный ID. Комбинация ID поставщика и SKU - хороший кандидат.
  const uniqueId = `remote-${supplier.id}-${remoteStock.sku}`

  return {
    id: uniqueId,
    sku: remoteStock.sku,
    description: remoteStock.description,
    imageUrl: PLACEHOLDER_IMAGE_URL,
    manufacturer: remoteStock.manufacturer || undefined,
    supplierName: supplier.name,
    supplierEmail: supplier.requestEmail,
    price: remoteStock.price ?? 0, // Предполагаем, что цена может приходить
    currencyCode: 'RUB', // Или получаем из `supplier` или `remoteStock`, если возможно
    availableQuantity: remoteStock.quantity,
    originalItem: { ...remoteStock, supplierId: supplier.id }, // Добавляем контекст
    source: 'remote',
  }
}
