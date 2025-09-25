import { Tenant } from '@/payload-types'
import Link from 'next/link'
import { Card, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Suspense } from 'react'
import { SupplierStockLoader } from './supplier-stock-loader'

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

  if (suppliersList.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 py-16 text-center dark:bg-gray-800">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Нет доступных поставщиков для поиска.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      {suppliersList.map((supplier) => (
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
          <Suspense fallback={<div>Загрузка данных ...</div>}>
            <SupplierStockLoader supplier={supplier} filters={filters} pagination={pagination} />
          </Suspense>
        </div>
      ))}
    </div>
  )
}
