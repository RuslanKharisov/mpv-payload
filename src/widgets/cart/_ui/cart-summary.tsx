import { CartEntry } from '@/entities/cart'
import { SendPriceRequestModal } from '@/features/send-price-request'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import { ArrowRight } from 'lucide-react'

interface CartSummaryProps {
  total: number
  currencyCode: string
  tenantName: string
  items: CartEntry[]
}

export function CartSummary({ total, currencyCode, tenantName, items }: CartSummaryProps) {
  return (
    <Card className="w-full self-start lg:w-1/3">
      <CardHeader>
        <CardTitle className="text-xl">Итог</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <p className="text-muted-foreground text-nowrap text-base">
            Стоимость товаров (без НДС):
          </p>
          <p className="font-semibold text-foreground">
            {currencyCode} {total.toFixed(2)}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <SendPriceRequestModal tenantName={tenantName} items={items} />
      </CardFooter>
    </Card>
  )
}
