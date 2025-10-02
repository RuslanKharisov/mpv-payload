import { caller as serverClient } from '@/shared/trpc/server'
import { StockResponse } from '@/entities/remote-stock/_domain/tstock-response'
import { GoogleStock } from './google-stock'
import { Tenant } from '@/payload-types'
import { Card, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import Link from 'next/link'

export async function SupplierStockLoader({
  supplier,
  filters,
  pagination,
}: {
  supplier: Tenant
  filters: { sku: string; description: string }
  pagination: { page: string; perPage: string }
}) {
  const searchQuery = JSON.stringify(filters)
  const url = `${supplier.apiUrl}?token=${supplier.apiToken}&page=${pagination.page}&per_page=${pagination.perPage}&filters=${searchQuery}`
  console.log('url ==> ', url)

  try {
    const response: StockResponse = await serverClient.remoteStocks.getByUrl({ url })

    if (!response?.data?.length) {
      return null
    }

    return (
      <div key={supplier.id} className="supplier_stock bg-card-foreground/5 px-3 py-5">
        <Card className=" gap-3 rounded-md">
          <CardHeader>
            <CardTitle className="uppercase">Контрагент: &quot;{supplier.name}&quot;</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col gap-2">
            <Button variant="secondary" className="w-full">
              <Link href={`/supplier/${supplier.slug}`}>Подробнее</Link>
            </Button>
          </CardFooter>
        </Card>
        <GoogleStock
          dataArray={response.data ?? []}
          count={response.meta.total ?? 0}
          supplier={supplier}
        />
      </div>
    )
  } catch (err) {
    console.error(`💥 ${supplier.name}: ошибка запроса`, err)
    return (
      <div className="text-red-500 text-sm px-4">Ошибка загрузки данных от {supplier.name}</div>
    )
  }
}
