'use client'

import { RemoteStock } from '@/entities/remote-stock'
import { useCart } from '@/features/cart/cart-provider'
import { mapLocalStockToCartItem } from '@/features/cart/lib/mappers'
import { StockWithTenantAndCurrency } from '@/features/stock'
import { Button } from '@/shared/ui/button'

interface AddToCartCellProps {
  stock: StockWithTenantAndCurrency
}

export function AddToCartCell({ stock }: AddToCartCellProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    const normalizedItem = mapLocalStockToCartItem(stock)
    addToCart(normalizedItem, 1)
  }

  return (
    <Button className="w-full text-xs" variant="outline" size="sm" onClick={handleAddToCart}>
      В корзину
    </Button>
  )
}
