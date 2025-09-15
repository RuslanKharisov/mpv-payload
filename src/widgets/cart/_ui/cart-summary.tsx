import { CartEntry } from '@/entities/cart'
import { SendPriceRequestModal } from '@/features/send-price-request'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'

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
  console.log('tenantEmail ==> ', tenantEmail)
  return (
    <Card className="w-full self-start lg:w-1/3">
      <CardHeader>
        <CardTitle className="text-xl">Итог</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-between">
          <p className="text-muted-foreground text-nowrap text-base">
            Стоимость товаров (без НДС):
          </p>
          <p className="font-semibold text-foreground">
            {currencyCode} {total.toFixed(2)}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <SendPriceRequestModal tenantName={tenantName} tenantEmail={tenantEmail} items={items} />
      </CardFooter>
    </Card>
  )
}
