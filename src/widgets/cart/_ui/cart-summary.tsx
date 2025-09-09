import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import { ArrowRight } from 'lucide-react'

interface CartSummaryProps {
  total: string
  currencyCode: string
}

export function CartSummary({ total, currencyCode }: CartSummaryProps) {
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
            {currencyCode} {total}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          Запросить предложение
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
