'use client'

import { ShoppingCart } from 'lucide-react'
import { CartContext } from '@/features/cart/cart-provider'
import Link from 'next/link'
import { useContext } from 'react'

export function CartIcon() {
  const cartContext = useContext(CartContext)

  // Если контекст недоступен (CartProvider не оборачивает компонент),
  // показываем иконку без счетчика
  if (!cartContext) {
    return (
      <Link href="/cart" className="relative inline-block">
        <ShoppingCart className="h-6 w-6 text-foreground" />
      </Link>
    )
  }

  const { items } = cartContext

  // Считаем общее количество товаров
  const totalCount = items.reduce((sum: number, entry) => sum + entry.quantity, 0)

  return (
    <Link href="/cart" className="relative inline-block">
      <ShoppingCart className="h-6 w-6 text-foreground" />

      {totalCount > 0 && (
        <span
          className="
            absolute -top-2 -right-2
            flex h-5 w-5 items-center justify-center
            rounded-full bg-red-500 text-white text-xs font-bold
          "
        >
          {totalCount}
        </span>
      )}
    </Link>
  )
}
