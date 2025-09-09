import { StockWithTenantAndCurrency } from '@/features/stock'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { CartItem } from './cart-item'

interface CartSupplierProps {
  tenantName: string
  items: Array<{
    stock: StockWithTenantAndCurrency
    quantity: number
  }>
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
        {items.map((item, index) => (
          <CartItem
            key={item.stock.id}
            item={item}
            isLastItem={index === items.length - 1}
            onRemove={onRemoveItem}
            onUpdateQuantity={onUpdateItemQuantity}
          />
        ))}
      </CardContent>
    </Card>
  )
}
