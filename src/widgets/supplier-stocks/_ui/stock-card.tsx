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
import { Typography } from '@/shared/ui/typography'

interface StockCardProps {
  stock: StockWithTenantAndCurrency
}

export function StockCard({ stock }: StockCardProps) {
  const product = stock.product
  const currency = typeof stock.currency === 'object' ? stock.currency : ({} as Currency)
  const tenant = typeof stock.tenant === 'object' ? stock.tenant : ({} as Tenant)

  return (
    <Card className="relative block min-h-41.5 w-full rounded-lg border p-6 text-sm after:pointer-events-none after:absolute after:inset-0 after:opacity-100 after:transition-opacity hover:after:shadow-md">
      <div className="grid grid-cols-1 gap-8 transition-all md:grid-cols-[132px_1fr_1fr] lg:grid-cols-[160px_1fr_1.2fr_1fr]">
        {/* элемент сетки 1 - фото */}
        <div className="flex aspect-square max-h-40.5 min-h-21.75 min-w-21.75 max-w-40.5 items-center justify-center rounded border p-1 transition-size relative mx-auto md:mx-0">
          <ImageMedia
            resource={product.productImage}
            fill
            imgClassName="object-contain object-center"
            pictureClassName="absolute inset-0 h-full w-full"
          />
        </div>

        {/* ------------ элемент сетки 1 -------------- */}
        <div className="flex flex-col justify-between">
          <div className="flex w-fit flex-col gap-2">
            <span className="uppercase text-muted-foreground">
              {product.brand?.name || 'Производитель'}
            </span>
            <Typography tag="h3" wrapper={false}>
              {product.sku || 'Product Name'}
            </Typography>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Состояние:</span>
              <span className="font-medium">{stock.condition || 'Не указано'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Доступность:</span>
              <span className="text-base font-semibold text-primary">{stock.quantity} шт.</span>
              {stock.quantity > 0 && (
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                >
                  <div className="h-2 w-2 rounded-full bg-green-600 mr-2"></div>В наличии
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* -------------- элемент сетки -------------- */}

        <div className="flex flex-col justify-end gap-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-muted-foreground">Предложение от:</span>
            <div className="font-medium inline-flex items-center gap-1">
              {stock.warehouse?.warehouse_address?.country_iso_code && (
                <Badge variant="default">
                  {stock.warehouse?.warehouse_address?.country_iso_code}
                </Badge>
              )}
              <Link
                className="cursor-pointer hover:underline hover:text-destructive transition-colors duration-300"
                href={`/supplier/${tenant.slug}`}
                target="_blank"
              >
                {tenant.name || 'Trusted Supplier'}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Адрес склада:</span>
            <span className="font-medium">
              {stock.warehouse?.warehouse_address?.city || 'Не указан'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Гарантия:</span>
            <span className="font-medium">
              {stock.warranty ? `${stock.warranty} мес.` : 'Не указана'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Обновлен:</span>
            <span className="font-medium">{formatDateTime(stock.updatedAt) || 'Не указана'}</span>
          </div>
        </div>

        {/* ---------- элемент сетки  --------------  */}

        <div className="flex flex-col justify-between items-start md:items-end gap-6">
          <div className="text-left md:text-right">
            {stock.price ? (
              <>
                <div className="text-3xl font-semibold leading-none">
                  {formatCurrency(stock.price, currency.code || '')}
                </div>
                <div className="text-sm text-muted-foreground">без НДС</div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Цена не указана</div>
            )}
          </div>
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            <SendPriceRequestModal
              tenantName={tenant.name}
              tenantEmail={tenant.requestEmail}
              items={[{ item: mapLocalStockToCartItem(stock), quantity: 1 }]}
            />
            <AddToCartCell stock={stock}></AddToCartCell>
          </div>
        </div>
      </div>
    </Card>
  )
}
