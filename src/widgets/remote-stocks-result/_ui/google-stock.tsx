'use client'

import { useEffect, useTransition, useState, JSX, useMemo, useRef } from 'react'
import { DataTable, usePagination } from '@/widgets/smart-data-table'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spinner } from '@/shared/ui/spinner'
import { ProductsTableColumns } from '@/entities/remote-stock/_vm/products-table-columns'
import { Tenant } from '@/payload-types'
import { RemoteStock } from '@/entities/remote-stock'

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
  const [showSpinner, setShowSpinner] = useState(false)

  const columns = useMemo(() => ProductsTableColumns(supplier), [supplier])

  const isInitialMount = useRef(true)

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
      {showSpinner && (
        <div className="absolute top-8 z-10 ">
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
