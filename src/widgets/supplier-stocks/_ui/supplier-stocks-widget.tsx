'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { AlertCircle, ShoppingCart, Store } from 'lucide-react'
import { useTRPC } from '@/shared/trpc/client'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/shared/ui/skeleton'
import { DataTable, usePagination } from '@/widgets/smart-data-table'
import { ProductsTableColumns } from '@/entities/stock/_vm/products-table-columns'
import { StockWithTenantAndCurrency } from '@/features/stock'
import { CardFooter } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { useCart } from '@/features/cart/cart-provider'
import { StockCard } from './stock-card'
import { Typography } from '@/shared/ui/typography'

type SupplierStockWidgetProps = {
  slug: string
}

function SupplierStockWidget({ slug }: SupplierStockWidgetProps) {
  const trpc = useTRPC()

  const { addToCart } = useCart()

  const { pagination, setPagination } = usePagination()

  const stocksQueryOptions = trpc.products.stocksBySlug.queryOptions({ slug })
  const { data, isError, isLoading } = useQuery(stocksQueryOptions)

  const datalist = data?.docs as StockWithTenantAndCurrency[]

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-5">
        <Store className="h-5 w-5 text-muted-foreground" />
        <Typography variant="poppins-md-24" tag="h2" className="font-semibold">
          Наличие у поставщиков
        </Typography>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          Ошибка загрузки наличия
        </div>
      )}

      {!isLoading && !isError && (!data || data.docs.length === 0) && (
        <p className="text-sm text-muted-foreground">Нет данных о наличии</p>
      )}

      {!isLoading && !isError && data && data.docs.length > 0 && (
        <div className="flex flex-col gap-4">
          {datalist.map((item) => (
            <StockCard key={item.id} stock={item} />
          ))}
        </div>
      )}
    </section>
  )
}

export { SupplierStockWidget }
