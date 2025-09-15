import { GoogleStock } from './google-stock'
import { Tenant } from '@/payload-types'
import Link from 'next/link'
import { Card, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { caller as serverClient } from '@/shared/trpc/server'
import { StockResponse, SupplierStock } from '@/entities/remote-stock/_domain/tstock-response'

export type SearchParams = {
  sku?: string
  description?: string
  page?: string
  perPage?: string
}

export async function StocksResults({
  searchParams,
  suppliersList,
}: {
  suppliersList: Tenant[]
  searchParams: SearchParams
}) {
  const filters = {
    sku: searchParams.sku?.trim() || '',
    description: searchParams.description?.trim() || '',
  }

  const pagination = {
    page: searchParams.page || '1',
    perPage: searchParams.perPage || '5',
  }

  // параллельные запросы через серверный trpc
  const results = await Promise.allSettled(
    suppliersList.map(async (supplier) => {
      const searchQuery = JSON.stringify(filters)
      const url = `${supplier.apiUrl}/exec?token=${supplier.apiToken}&page=${pagination.page}&per_page=${pagination.perPage}&filters=${searchQuery}`

      try {
        const response: StockResponse = await serverClient.remoteStocks.getByUrl({ url })

        if (!response?.data?.length) {
          return null
        }

        return {
          supplier,
          data: response.data,
          meta: response.meta,
        }
      } catch (err) {
        console.error(`💥 ${supplier.name}: ошибка запроса`, err)
        return null
      }
    }),
  )

  const validResults = results
    .filter(
      (r): r is PromiseFulfilledResult<SupplierStock> =>
        r.status === 'fulfilled' && r.value !== null,
    )
    .map((r) => r.value)

  if (validResults.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 py-16 text-center dark:bg-gray-800">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Поиск товаров не дал результатов.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 ">
      {validResults.map(({ supplier, data, meta }) => (
        <div key={supplier.id} className="supplier_stock bg-card-foreground/5 px-3 py-5">
          <Card className=" gap-3 rounded-md">
            <CardHeader>
              <CardTitle className="uppercase">Контрагент: &quot;{supplier.name}&quot;</CardTitle>
            </CardHeader>
            {/* <CardContent></CardContent> */}
            <CardFooter className="flex-col gap-2">
              <Button variant="secondary" className="w-full">
                <Link href={`/supplier/${supplier.slug}`}>Подробнее</Link>
              </Button>
            </CardFooter>
          </Card>
          <GoogleStock dataArray={data ?? []} count={meta.total ?? 0} supplier={supplier} />
        </div>
      ))}
    </div>
  )
}
