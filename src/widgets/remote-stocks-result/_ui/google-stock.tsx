'use client'

import { useEffect, useTransition, useState, JSX, useMemo } from 'react'
import { DataTable, usePagination } from '@/widgets/smart-data-table'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spinner } from '@/shared/ui/spinner'
import { ProductsTableColumns } from '@/entities/remote-stock/_vm/products-table-columns'
import { Tenant } from '@/payload-types'

interface GoogleStockProps {
  dataArray: any[]
  count: number
  supplier: Tenant // ✅ Добавляем supplier в props
}

function GoogleStock({ dataArray, count, supplier }: GoogleStockProps): JSX.Element {
  const { pagination, setPagination } = usePagination()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isPending, startTransition] = useTransition()
  const [showSpinner, setShowSpinner] = useState(false)

  const columns = useMemo(() => ProductsTableColumns(supplier), [supplier])

  useEffect(() => {
    setShowSpinner(true)

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', (pagination.pageIndex + 1).toString())
      params.set('perPage', pagination.pageSize.toString())
      router.push(`?${params.toString()}`)
    })
  }, [pagination])

  // Убираем спиннер чуть позже, чтобы не мигал
  useEffect(() => {
    if (!isPending) {
      const timer = setTimeout(() => setShowSpinner(false), 100)
      return () => clearTimeout(timer)
    }
  }, [isPending])

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
        handleDelete={() => {}}
      />
    </div>
  )
}

export { GoogleStock }
