'use client'

import { useCart } from '@/features/cart/cart-provider' // Убедитесь, что импорт правильный
import { Separator } from '@/shared/ui/separator'
import { CartHeader } from './cart-header'
import { CartSummary } from './cart-summary'
import { CartSupplier } from './cart-supplier'
import { useEffect, useState } from 'react'
import { CartEntry } from '@/entities/cart/_domain/normalized-cartItem'

// 1. Обновляем тип для сгруппированных элементов.
// Ключ - имя поставщика, значение - массив записей корзины (CartEntry).
type GroupedItems = {
  [supplierKey: string]: {
    supplierName: string
    supplierEmail: string
    entries: CartEntry[]
  }
}

export function CartWidget() {
  // Хук теперь возвращает `items` типа `CartEntry[]`
  const { items, removeFromCart, clearCart, updateQuantity } = useCart()

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  if (items.length === 0) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Ваша корзина</h1>
        <p className="text-muted-foreground">В корзине пока пусто.</p>
      </div>
    )
  }

  const groupedItems = items.reduce((acc, entry) => {
    const { supplierName, supplierEmail } = entry.item
    const key = supplierEmail || supplierName // уникальнее почта, можно сделать ключом

    if (!acc[key]) {
      acc[key] = {
        supplierName,
        supplierEmail,
        entries: [],
      }
    }

    acc[key].entries.push(entry)
    return acc
  }, {} as GroupedItems)

  // 3. Исправляем функцию подсчета суммы.
  // Она принимает массив `CartEntry` и работает с плоской структурой.
  const calculateSupplierTotal = (supplierEntries: CartEntry[]) =>
    supplierEntries.reduce((total, entry) => {
      const price = entry.item.price ?? 0
      return total + price * entry.quantity
    }, 0)

  return (
    <div className="relative py-8">
      <div className="container mx-auto">
        <CartHeader onClear={clearCart} />

        {Object.values(groupedItems).map(({ supplierName, supplierEmail, entries }, index) => (
          <div key={supplierEmail || supplierName}>
            <div className="flex flex-col lg:flex-row gap-6">
              <CartSupplier
                tenantName={supplierName}
                items={entries}
                onRemoveItem={removeFromCart}
                onUpdateItemQuantity={updateQuantity}
              />

              <CartSummary
                total={calculateSupplierTotal(entries)}
                currencyCode={entries[0]?.item.currencyCode || ''}
                tenantName={supplierName}
                tenantEmail={supplierEmail} // <-- вот тут пробрасываешь
                items={entries}
              />
            </div>
            {index < Object.keys(groupedItems).length - 1 && <Separator className="my-8" />}
          </div>
        ))}
      </div>
    </div>
  )
}
