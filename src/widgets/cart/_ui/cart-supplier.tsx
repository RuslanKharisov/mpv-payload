import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { CartItem } from './cart-item'
import { CartEntry } from '@/entities/cart'

interface CartSupplierProps {
  tenantName: string
  items: CartEntry[]
  onRemoveItem: (stockId: string) => void
  onUpdateItemQuantity: (stockId: string, newQuantity: number) => void
}

export function CartSupplier({
  tenantName,
  items,
  onRemoveItem,
  onUpdateItemQuantity,
}: CartSupplierProps) {
  return (
    <Card className="lg:w-2/3">
      <CardHeader className="bg-muted/50">
        <h3 className="text-sm font-semibold sm:text-base">{tenantName}</h3>
      </CardHeader>
      <CardContent className="p-0">
        {items.map((entry, index) => (
          <CartItem
            key={entry.item.id}
            entry={entry}
            isLastItem={index === items.length - 1}
            onRemove={onRemoveItem}
            onUpdateQuantity={onUpdateItemQuantity}
          />
        ))}
      </CardContent>
    </Card>
  )
}
