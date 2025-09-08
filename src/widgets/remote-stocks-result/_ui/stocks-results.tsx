'use client'

import { useTRPC } from '@/shared/trpc/client'
import { GoogleStock } from './google-stock'
import { Tenant } from '@/payload-types'
import { useQueries } from '@tanstack/react-query'
import Link from 'next/link'
import { Spinner } from '@/shared/ui/spinner'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'

export type SearchParams = {
  sku: string
  description: string
  page?: string
  perPage?: string
}

export function StocksResults({
  searchParams,
  suppliersList,
}: {
  suppliersList: Tenant[]
  searchParams: SearchParams
}) {
  const trpc = useTRPC()

  const filters = {
    sku: searchParams.sku?.trim() || '',
    description: searchParams.description?.trim() || '',
  }

  const pagination = {
    page: searchParams.page || '1',
    perPage: searchParams.perPage || '5',
  }

  // формируем массив запросов
  const results = useQueries({
    queries: suppliersList.map((supplier) => {
      const searchQuery = JSON.stringify(filters)
      const url = `${supplier.apiUrl}/exec?token=${supplier.apiToken}&page=${pagination.page}&per_page=${pagination.perPage}&filters=${searchQuery}`
      return trpc.remoteStocks.getByUrl.queryOptions({ url })
    }),
  })

  // обработка состояния
  const isLoading = results.some((r) => r.isLoading)
  const isError = results.some((r) => r.isError)

  if (isLoading)
    return (
      <div className="text-center">
        <Spinner />
      </div>
    )
  if (isError) return <div className="text-center text-destructive">Ошибка загрузки</div>

  const validResults = results
    .map((r, i) => ({
      supplier: suppliersList[i],
      data: r.data,
    }))
    .filter((r) => r.data)

  if (validResults.length === 0) {
    return <div className="text-center text-muted">Ничего не найдено</div>
  }
  console.log('validResults ==> ', validResults)

  return (
    <>
      {validResults.map(({ supplier, data }) => (
        <div key={supplier.id} className="">
          <Card className="w-full gap-3 rounded-md">
            <CardHeader>
              <CardTitle className="uppercase">Контрагент: "{supplier.name}"</CardTitle>
            </CardHeader>
            {/* <CardContent></CardContent> */}
            <CardFooter className="flex-col gap-2">
              <Button variant="secondary" className="w-full">
                <Link href={`/supplier/${supplier.slug}`}>Подробнее</Link>
              </Button>
            </CardFooter>
          </Card>
          <GoogleStock dataArray={data?.data ?? []} count={data?.meta?.total ?? 0} />
        </div>
      ))}
    </>
  )
}
