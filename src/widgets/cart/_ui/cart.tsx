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
  [supplierName: string]: CartEntry[]
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

  // 2. Исправляем логику группировки.
  // Теперь работаем с `entry`, который имеет структуру { item: NormalizedCartItem, quantity: number }
  const groupedItems = items.reduce((acc, entry) => {
    const supplierName = entry.item?.supplierName || 'Unknown Supplier'
    if (!acc[supplierName]) {
      acc[supplierName] = []
    }
    // В массив добавляем всю запись `entry`, а не только имя.
    acc[supplierName].push(entry)
    return acc
  }, {} as GroupedItems)

  // 3. Исправляем функцию подсчета суммы.
  // Она принимает массив `CartEntry` и работает с плоской структурой.
  const calculateSupplierTotal = (supplierEntries: CartEntry[]) =>
    supplierEntries
      .reduce((total, entry) => {
        const price = entry.item.price ?? 0
        return total + price * entry.quantity
      }, 0)
      .toFixed(2)

  return (
    <div className="relative mt-[30px] flex p-6 md:mt-[90px]">
      <div className="container mx-auto">
        <CartHeader onClear={clearCart} />

        {/* `supplierItems` теперь является массивом `CartEntry[]` */}
        {Object.entries(groupedItems).map(([tenantName, supplierItems], index) => (
          <div key={tenantName}>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* CartSupplier теперь получает `CartEntry[]` */}
              <CartSupplier
                tenantName={tenantName}
                items={supplierItems} // Передаем сгруппированные `CartEntry`
                onRemoveItem={removeFromCart}
                onUpdateItemQuantity={updateQuantity}
              />
              {/* 4. Исправляем доступ к данным для CartSummary */}
              <CartSummary
                total={calculateSupplierTotal(supplierItems)}
                // Безопасно получаем currencyCode из первого элемента
                currencyCode={supplierItems[0]?.item.currencyCode || ''}
              />
            </div>
            {index < Object.keys(groupedItems).length - 1 && <Separator className="my-8" />}
          </div>
        ))}
      </div>
    </div>
  )
}
