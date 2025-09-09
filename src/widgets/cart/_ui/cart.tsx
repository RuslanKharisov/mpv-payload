'use client'

import { useCart } from '@/features/cart/CartProvider'
import { StockWithTenantAndCurrency } from '@/features/stock'
import { Separator } from '@/shared/ui/separator'
import { CartHeader } from './cart-header'
import { CartSummary } from './cart-summary'
import { CartSupplier } from './cart-supplier'

type GroupedItems = {
  [key: string]: Array<{
    stock: StockWithTenantAndCurrency
    quantity: number
  }>
}

export function CartWidget() {
  const { items, removeFromCart, clearCart, updateQuantity } = useCart()

  if (items.length === 0) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Ваша корзина</h1>
        <p className="text-muted-foreground">В корзине пока пусто.</p>
      </div>
    )
  }

  const groupedItems = items.reduce((acc, item) => {
    const tenantName = item.stock.tenant.name || 'Unknown Supplier'
    if (!acc[tenantName]) acc[tenantName] = []
    acc[tenantName].push(item)
    return acc
  }, {} as GroupedItems)

  const calculateSupplierTotal = (supplierItems: any[]) =>
    supplierItems.reduce((total, item) => total + item.stock.price * item.quantity, 0).toFixed(2)

  return (
    <div className="relative mt-[30px] flex p-6 md:mt-[90px]">
      <div className="container mx-auto max-w-screen-xl">
        <CartHeader onClear={clearCart} />

        {Object.entries(groupedItems).map(([tenantName, supplierItems], index) => (
          <div key={tenantName}>
            <div className="flex flex-col lg:flex-row gap-6">
              <CartSupplier
                tenantName={tenantName}
                items={supplierItems}
                onRemoveItem={removeFromCart}
                onUpdateItemQuantity={updateQuantity}
              />
              <CartSummary
                total={calculateSupplierTotal(supplierItems)}
                currencyCode={supplierItems[0].stock.currency.code}
              />
            </div>
            {/* Добавляем Separator после каждого блока, кроме последнего */}
            {index < Object.keys(groupedItems).length - 1 && <Separator className="my-8" />}
          </div>
        ))}
      </div>
    </div>
  )
}
