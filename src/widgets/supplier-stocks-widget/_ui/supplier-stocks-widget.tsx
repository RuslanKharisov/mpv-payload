'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { AlertCircle, Store } from 'lucide-react'
import { useTRPC } from '@/shared/trpc/client'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/shared/ui/skeleton'

type SupplierStockWidgetProps = {
  slug: string
}

export default function SupplierStockWidget({ slug }: SupplierStockWidgetProps) {
  const trpc = useTRPC()

  const stocksQueryOptions = trpc.products.stocksBySlug.queryOptions({ slug })
  const { data, isLoading, isError } = useQuery(stocksQueryOptions)

  if (!data) return null

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
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[40%]">Компания</TableHead>
                  <TableHead className="w-[20%]">Кол-во</TableHead>
                  <TableHead className="w-[20%]">Цена</TableHead>
                  <TableHead className="w-[20%]">Обновлено</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.docs.map((stock) => (
                  <TableRow key={`${stock.id}`} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      {stock.tenant && typeof stock.tenant === 'object' && 'name' in stock.tenant
                        ? stock.tenant.name
                        : (stock.tenant ?? '—')}
                    </TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>
                      {stock.price != null
                        ? stock.price.toLocaleString('ru-RU', {
                            style: 'currency',
                            currency:
                              typeof stock.currency === 'object' &&
                              stock.currency !== null &&
                              'code' in stock.currency
                                ? stock.currency.code
                                : 'RUB',
                          })
                        : '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {stock.updatedAt
                        ? new Date(stock.updatedAt).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
