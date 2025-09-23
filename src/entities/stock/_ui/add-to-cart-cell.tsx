'use client'

import { useCart } from '@/features/cart/cart-provider'
import { mapLocalStockToCartItem } from '@/features/cart/lib/mappers'
import { StockWithTenantAndCurrency } from '@/features/stock'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/ui/utils'
import { ReactNode } from 'react'

interface AddToCartCellProps {
  stock: StockWithTenantAndCurrency
  children?: ReactNode
  className?: string
}

export function AddToCartCell({ stock, children, className }: AddToCartCellProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    const normalizedItem = mapLocalStockToCartItem(stock)
    addToCart(normalizedItem, 1)
  }

  return (
    <Button
      className={cn('w-full text-xs', className)}
      variant="outline"
      size="sm"
      onClick={handleAddToCart}
    >
      {children ? children : 'В корзину'}
    </Button>
  )
}
