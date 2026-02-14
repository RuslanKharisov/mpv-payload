import { Tenant } from '@/payload-types'
import { caller as serverClient } from '@/shared/trpc/server'
import { Button } from '@/shared/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import Link from 'next/link'
import { GoogleStock } from './google-stock'

export async function SupplierStockLoader({
  supplier,
  filters,
  pagination,
}: {
  supplier: Tenant
  filters: { sku: string; description: string }
  pagination: { page: string; perPage: string }
}) {
  try {
    const response = await serverClient.remoteStocks.getByUrl({
      tenantId: supplier.id,
      filters,
      page: Number(pagination.page) || 1,
      perPage: Number(pagination.perPage) || 20,
    })

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
