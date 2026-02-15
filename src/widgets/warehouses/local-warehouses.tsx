'use client'

import { LocalStocksTableColumns } from '@/entities/stocks/_vm/local-stocks-table-columns'
import { StockWithRelations } from '@/entities/stocks/model/stock-with-relations'
import { Spinner } from '@/shared/ui/spinner'
import { DataTable, usePagination } from '@/widgets/smart-data-table'
import { useRouter, useSearchParams } from 'next/navigation'
import { JSX, useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'

interface LocalWarehousesProps {
  initialData: StockWithRelations[]
  total: number
  initialPage: number
  initialPerPage: number
}

function LocalWarehouses({
  initialData,
  total,
  initialPage,
  initialPerPage,
}: LocalWarehousesProps): JSX.Element {
  const { pagination, setPagination } = usePagination()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isPending, startTransition] = useTransition()
  const [showSpinner, setShowSpinner] = useState(false)

  const columns = useMemo(() => LocalStocksTableColumns, [])

  // Initialize pagination from props
  useEffect(() => {
    setPagination({
      pageIndex: initialPage - 1,
      pageSize: initialPerPage,
    })
  }, [initialPage, initialPerPage])
  // Add setPagination if eslint exhaustive-deps warn

  const isMounted = useRef(false)

  useEffect(() => {
    // Skip first render to avoid unnecessary router.push on mount
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    setShowSpinner(true)

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', (pagination.pageIndex + 1).toString())
      params.set('perPage', pagination.pageSize.toString())
      router.push(`?${params.toString()}`)
    })
  }, [pagination, searchParams])

  const handleDelete = useCallback(() => {}, [])

  // Hide spinner shortly after transition completes to avoid flickering
  useEffect(() => {
    if (!isPending) {
      const timer = setTimeout(() => setShowSpinner(false), 50)
      return () => clearTimeout(timer)
    }
  }, [isPending])

  return (
    <div className="relative">
      {showSpinner && (
        <div className="absolute top-8 z-10">
          <Spinner />
        </div>
      )}
      <DataTable
        columns={columns}
        data={initialData}
        onPaginationChange={setPagination}
        pagination={pagination}
        rowCount={total}
        manualPagination={true}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export { LocalWarehouses }
