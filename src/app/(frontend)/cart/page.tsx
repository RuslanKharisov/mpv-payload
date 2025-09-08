'use client'

import { useCart } from '@/features/cart/CartProvider'
import { Button } from '@/shared/ui/button'

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCart()
  console.log('items ==> ', items)

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-2xl font-semibold mb-6">Корзина</h1>

      {items.length === 0 ? (
        <p className="text-muted-foreground">В корзине пока пусто.</p>
      ) : (
        <div className="space-y-6">
          <ul className="space-y-2">
            {items.map(({ stock, quantity }) => (
              <li key={stock.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{stock.tenant.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {stock.currency.code} — {quantity} шт.
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFromCart(stock.id)}>
                  Удалить
                </Button>
              </li>
            ))}
          </ul>

          <div className="flex gap-4">
            <Button onClick={() => console.log('📤 Заказ:', items)}>Отправить заказ</Button>
            <Button variant="outline" onClick={clearCart}>
              Очистить
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
