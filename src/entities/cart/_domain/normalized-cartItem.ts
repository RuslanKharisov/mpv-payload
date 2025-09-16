export interface NormalizedCartItem {
  id: string // Уникальный идентификатор (важно!)
  sku: string
  description?: string
  imageUrl: string
  brand?: string
  supplierName: string
  supplierEmail: string
  price?: number
  currencyCode: string
  availableQuantity: number

  // Сохраняем исходный объект для возможных будущих нужд (например, при оформлении заказа)
  originalItem: unknown
  source: 'local' | 'remote' // Чтобы знать, откуда пришел товар
}

export type CartEntry = {
  item: NormalizedCartItem
  quantity: number
}
