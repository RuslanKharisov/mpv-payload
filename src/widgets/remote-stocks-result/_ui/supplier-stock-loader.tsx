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

  try {
    const response: StockResponse = await serverClient.remoteStocks.getByUrl({ url })

    if (!response?.data?.length) {
      return null
    }

    // Проверяем что sku, description, quantity пристутсвуют в ответе и они не пустые
    const hasActualData = response.data.some(
      (item) =>
        (item.sku && item.sku?.trim() !== '') ||
        (item.description && item.description?.trim() !== '') ||
        (item.quantity && item.quantity > 0),
    )

    if (!hasActualData) {
      console.log(`Данные от ${supplier.name} получены, но они пустые.`)
      return null
    }

    return (
      <div key={supplier.id} className="supplier_stock bg-card-foreground/5 px-3 py-5">
        <Card className=" gap-3 rounded-md">
          <CardHeader>
            <CardTitle className="uppercase">Контрагент: &quot;{supplier.name}&quot;</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col gap-2">
            <Button asChild variant="default" className="w-full">
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
    console.error(`💥 ${supplier.name}: ошибка запроса (проверить API URL)`, err)
    return null
  }
}
