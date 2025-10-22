import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { StockWithTenantAndCurrency } from '@/features/stock'
import { Currency, Tenant } from '@/payload-types'
import { AddToCartCell } from '@/entities/stock/_ui/add-to-cart-cell'
import { SendPriceRequestModal } from '@/features/send-price-request'
import { mapLocalStockToCartItem } from '@/features/cart/lib/mappers'
import { formatDateTime } from '@/shared/utilities/formatDateTime'
import { formatCurrency } from '@/shared/utilities/formatAmountWithСurency'
import { ImageMedia } from '@/components/Media/ImageMedia'
import Link from 'next/link'

interface StockCardProps {
  stock: StockWithTenantAndCurrency
}

export function StockCard({ stock }: StockCardProps) {
  const product = stock.product
  const currency = typeof stock.currency === 'object' ? stock.currency : ({} as Currency)
  const tenant = typeof stock.tenant === 'object' ? stock.tenant : ({} as Tenant)

  return (
    <Card className="relative block min-h-[166px] w-full cursor-pointer rounded-lg border border-[#EAEAEA] p-4 text-sm after:pointer-events-none after:absolute after:inset-0 after:opacity-100 after:transition-opacity hover:after:shadow-md">
      <div className="grid grid-cols-[103px_1fr] gap-6 transition-all max-md:gap-2 max-md:gap-y-5 md:grid-cols-[132px_1fr_1fr] lg:grid-cols-[160px_1fr_1.2fr_1fr]">
        {/* элемент сетки 1 */}
        <div className="flex aspect-square max-h-[162px] min-h-[87px] min-w-[87px] max-w-[162px] items-center justify-center rounded border-1 border-solid border-[#F4F4F4] p-1 transition-size max-md:max-h-[132px] relative">
          <ImageMedia
            resource={product.productImage}
            fill
            imgClassName="object-contain object-center"
            pictureClassName="absolute inset-0 h-full w-full"
          />
        </div>

        {/* ------------ элемент сетки 1 -------------- */}
        <div className="flex flex-col md:gap-4">
          <div className="w-fit gap-[6px]">
            <p className="text-sm uppercase text-[#4A4D58]">
              {(product.brand?.name && product.brand?.name) || 'Производитель'}
            </p>
            <h3 className="text-base font-semibold transition-all hover:text-primary-default hover:underline md:text-lg">
              {product.sku || 'Product Name'}
            </h3>
            <p className="text-sm text-primary-grey">
              <span className="font-normal">Состояние: </span>
              <span>{stock.condition || 'Не указано'}</span>
            </p>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            <dt className="flex flex-shrink-0 items-center gap-1.5">
              <span className="opacity-70">Доступность:</span>
            </dt>
            <dd className="truncate font-medium">
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
            </dd>
          </div>
        </div>

        {/* -------------- элемент сетки -------------- */}

        <div className="flex flex-col gap-y-3 max-lg:col-span-2">
          <div className="flex gap-2">
            <span className="opacity-70">Предложение от: </span>
            <div className="font-medium inline-flex items-center gap-1 ">
              {stock.warehouse?.warehouse_address?.country_iso_code && (
                <Badge variant="default" className="">
                  {stock.warehouse?.warehouse_address?.country_iso_code}
                </Badge>
              )}
              <Link
                className="cursor-pointer hover:underline hover:text-destructive duration-300"
                href={`/supplier/${tenant.slug}`}
                target="blank"
              >
                {tenant.name || 'Trusted Supplier'}
              </Link>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="opacity-70">Адрес склада:</span>
            <div className="font-medium">{stock.warehouse?.warehouse_address?.city}</div>
          </div>
          <div className="flex gap-2">
            <span className="opacity-70">Гарантия:</span>
            <div className="font-medium">{stock.warranty || 'Не указана'} мес.</div>
          </div>
          <div className="flex gap-2">
            <span className="opacity-70">Обновлен:</span>
            <div className="font-medium">{formatDateTime(stock.updatedAt) || 'Не указана'}.</div>
          </div>
        </div>

        {/* ---------- элемент сетки  --------------  */}

        <div className="flex flex-col justify-between items-end max-md:col-span-2">
          <div className="text-right">
            {stock.price && (
              <div className="text-3xl font-semibold leading-none">
                {formatCurrency(stock.price, currency.code || '')}
              </div>
            )}
            <div className="text-sm text-[#1E222C]">без НДС</div>
          </div>
          <div className="flex flex-col gap-2 w-full lg:w-auto">
            <SendPriceRequestModal
              tenantName={tenant.name}
              tenantEmail={tenant.requestEmail}
              items={[{ item: mapLocalStockToCartItem(stock), quantity: 1 }]}
            />
            <AddToCartCell stock={stock} className=""></AddToCartCell>
          </div>
        </div>
      </div>
    </Card>
  )
}
