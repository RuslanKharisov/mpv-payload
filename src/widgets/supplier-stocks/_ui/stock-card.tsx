import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import Image from 'next/image'
import { StockWithTenantAndCurrency } from '@/features/stock'
import { Currency, Product, Tenant } from '@/payload-types'
import { AddToCartCell } from '@/entities/stock/_ui/add-to-cart-cell'

interface StockCardProps {
  stock: StockWithTenantAndCurrency
}

// Пример функции для форматирования валюты
const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: currencyCode }).format(
    amount,
  )
}

export function StockCard({ stock }: StockCardProps) {
  console.log('stock ==> ', stock)
  // Убедимся, что product и currency являются объектами
  const product = stock.product
  const currency = typeof stock.currency === 'object' ? stock.currency : ({} as Currency)
  const tenant = typeof stock.tenant === 'object' ? stock.tenant : ({} as Tenant)

  return (
    <Card className="w-full cursor-pointer rounded-lg border border-[#EAEAEA] p-4 text-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-[103px_1fr] gap-6 md:grid-cols-[132px_1fr_1fr] lg:grid-cols-[160px_1fr_1.2fr_1fr]">
        <div className="flex items-center justify-center rounded border border-[#F4F4F4] p-1 aspect-square">
          <Image
            alt={product.name || 'Product Image'}
            className="h-full w-full object-contain"
            height="130"
            src={product.productImage.thumbnailURL || '/placeholder.svg'} // Запасное изображение
            width="130"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm uppercase text-[#4A4D58]">
              {(product.brand.name && product.brand.name) || 'Производитель'}
            </p>
            <h3 className="text-base font-semibold transition-all hover:text-primary-default hover:underline md:text-lg">
              {stock.title_in_admin || product.name || 'Product Name'}
            </h3>
            <p className="text-sm text-primary-grey">
              <span className="font-normal">Состояние: </span>
              <span>{stock.condition || 'Не указано'}</span>
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="opacity-70">Доступность:</span>
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-primary-default">
                {stock.quantity} шт.
              </span>
              {stock.quantity > 0 && (
                <Badge variant="outline" className="bg-green-100 text-green-600 border-none">
                  <div className="h-2 w-2 rounded-full bg-green-600 mr-2"></div>В наличии
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-3 max-lg:col-span-2">
          <div>
            <span className="opacity-70">Предложение от: </span>
            <div className="font-medium inline-flex items-center gap-1 cursor-pointer hover:underline">
              {tenant.countryCode && (
                <img
                  className="w-4 h-3"
                  alt={tenant.countryCode}
                  src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${tenant.countryCode.toLowerCase()}.svg`}
                />
              )}
              {tenant.name || 'Trusted Supplier'}
            </div>
          </div>
          <div>
            <span className="opacity-70">Предполагаемая доставка:</span>
            <div className="font-medium">18-19 September to Germany</div>
          </div>
          <div>
            <span className="opacity-70">Гарантия:</span>
            <div className="font-medium">{stock.warranty || 'Не указана'} мес.</div>
          </div>
        </div>

        <div className="flex flex-col justify-between items-end max-md:col-span-2">
          <div className="text-right">
            {stock.price && (
              <div className="text-3xl font-semibold leading-none">
                {formatCurrency(stock.price, currency.code || 'EUR')}
              </div>
            )}
            <div className="text-sm text-[#1E222C]">без НДС</div>
          </div>
          <div className="flex flex-col gap-2 w-full lg:w-auto">
            <Button className="w-full bg-success-default text-white">Buy Now</Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Запросить предложение
              </Button>
              <AddToCartCell stock={stock} className="w-fit"></AddToCartCell>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
