'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/features/cart/cart-provider'
import Link from 'next/link'

export function CartIcon() {
  const { items } = useCart()

  // Считаем общее количество товаров
  const totalCount = items.reduce((sum, entry) => sum + entry.quantity, 0)

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
