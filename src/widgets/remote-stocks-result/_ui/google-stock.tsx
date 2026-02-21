'use client'

import { RemoteStock } from '@/entities/remote-stock'
import { ProductsTableColumns } from '@/entities/remote-stock/_vm/products-table-columns'
import { Tenant } from '@/payload-types'
import { Spinner } from '@/shared/ui/spinner'
import { DataTable, usePagination } from '@/widgets/smart-data-table'
import { useRouter, useSearchParams } from 'next/navigation'
import { JSX, useEffect, useMemo, useTransition } from 'react'

interface GoogleStockProps {
  dataArray: RemoteStock[]
  count: number
  supplier?: Tenant
}

function GoogleStock({ dataArray, count, supplier }: GoogleStockProps): JSX.Element {
  const { pagination, setPagination } = usePagination()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isPending, startTransition] = useTransition()

  const columns = useMemo(() => ProductsTableColumns(supplier), [supplier])

  useEffect(() => {
    const pageStr = (pagination.pageIndex + 1).toString()
    const perPageStr = pagination.pageSize.toString()

    // Проверка: если URL уже такой же, как стейт — ничего не делаем
    if (searchParams.get('page') === pageStr && searchParams.get('perPage') === perPageStr) {
      return
    }

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', pageStr)
      params.set('perPage', perPageStr)
      router.push(`?${params.toString()}`, { scroll: false })
    })

    // Следим за примитивами, а не за объектом!
  }, [pagination.pageIndex, pagination.pageSize, router, searchParams])

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute -top-10 left-1/2 z-10 ">
          <Spinner />
        </div>
      )}
      <DataTable
        columns={columns}
        data={dataArray}
        onPaginationChange={setPagination}
        pagination={pagination}
        rowCount={count}
        manualPagination={true}
        handleDelete={() => undefined}
      />
    </div>
  )
}

export { GoogleStock }
