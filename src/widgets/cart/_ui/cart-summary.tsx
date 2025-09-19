import { CartEntry } from '@/entities/cart'
import { SendPriceRequestModal } from '@/features/send-price-request'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import { formatCurrency } from '@/shared/utilities/formatAmountWithСurency'

interface CartSummaryProps {
  total: number
  currencyCode: string
  tenantName: string
  tenantEmail: string
  items: CartEntry[]
}

export function CartSummary({
  total,
  currencyCode,
  tenantName,
  tenantEmail,
  items,
}: CartSummaryProps) {
  return (
    <Card className="w-full self-start lg:w-1/3">
      <CardHeader>
        <CardTitle className="text-xl">Итог</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1 justify-between">
          <p className="text-muted-foreground text-nowrap text-base">
            Стоимость товаров (без НДС):
          </p>
          <div className="text-2xl font-semibold leading-none">
            {formatCurrency(total, currencyCode || '')}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <SendPriceRequestModal tenantName={tenantName} tenantEmail={tenantEmail} items={items} />
      </CardFooter>
    </Card>
  )
}
