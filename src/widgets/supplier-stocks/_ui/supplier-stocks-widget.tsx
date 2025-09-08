'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { AlertCircle, Store } from 'lucide-react'
import { useTRPC } from '@/shared/trpc/client'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/shared/ui/skeleton'
import { DataTable, usePagination } from '@/widgets/smart-data-table'
import { ProductsTableColumns } from '@/entities/stock/_vm/products-table-columns'
import { StockWithTenantAndCurrency } from '@/features/stock'

type SupplierStockWidgetProps = {
  slug: string
}

function SupplierStockWidget({ slug }: SupplierStockWidgetProps) {
  const trpc = useTRPC()

  const { pagination, setPagination } = usePagination()

  const stocksQueryOptions = trpc.products.stocksBySlug.queryOptions({ slug })
  const { data, isLoading, isError } = useQuery(stocksQueryOptions)

  if (!data) return null

  console.log('data ==> ', data)

  return (
    <Card className="mt-8 rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Store className="h-5 w-5 text-muted-foreground" />
          Наличие у поставщиков
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full rounded-lg" />
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
          <div className="overflow-x-auto">
            <DataTable<StockWithTenantAndCurrency, unknown>
              columns={ProductsTableColumns}
              data={data.docs as StockWithTenantAndCurrency[]}
              onPaginationChange={setPagination}
              pagination={pagination}
              rowCount={data.docs.length}
              manualPagination={true}
              handleDelete={() => {}}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { SupplierStockWidget }
