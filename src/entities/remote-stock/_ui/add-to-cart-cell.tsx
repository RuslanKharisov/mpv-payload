'use client'

import { RemoteStock } from '@/entities/remote-stock'
import { useCart } from '@/features/cart/cart-provider'
import { mapRemoteStockToCartItem } from '@/features/cart/lib/mappers'
import { Tenant } from '@/payload-types'
import { Button } from '@/shared/ui/button'

interface AddToCartCellProps {
  stock: RemoteStock
  supplier: Tenant
}

export function AddToCartCell({ stock, supplier }: AddToCartCellProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    const normalizedItem = mapRemoteStockToCartItem(stock, supplier)
    addToCart(normalizedItem, 1)
  }

  return (
    <Button className="w-full text-xs" variant="outline" size="sm" onClick={handleAddToCart}>
      В корзину
    </Button>
  )
}
