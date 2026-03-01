'use client'

import { useState } from 'react'
import { DataTable } from '@/widgets/smart-data-table'
import { Spinner } from '@/shared/ui/spinner'
import { ProductsTableColumnsPublic } from '@/entities/remote-stock'
import { Tenant } from '@/payload-types'
import { useTRPC } from '@/shared/trpc/client'
import { useQuery } from '@tanstack/react-query'
import type { PaginationState, OnChangeFn } from '@tanstack/react-table'

interface GoogleStockPublicProps {
  supplier: Tenant
  filters: {
    sku: string
    description: string
  }
}

export function GoogleStockPublic({ supplier, filters }: GoogleStockPublicProps) {
  const trpc = useTRPC()

  // Локальная пагинация (не через URL)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const remoteStocksQueryOptions = trpc.remoteStocks.getByUrlPublic.queryOptions({
    tenantId: supplier.id,
    filters: {
      sku: filters.sku,
      description: filters.description,
    },
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
  })

  const { data, isFetching } = useQuery({
    ...remoteStocksQueryOptions,
    placeholderData: (previousData) => previousData,
  })

  const handlePaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    setPagination((old) => {
      const newValue = typeof updaterOrValue === 'function' ? updaterOrValue(old) : updaterOrValue
      return newValue
    })
  }

  const columns = ProductsTableColumnsPublic(supplier)

  if (!data?.data?.length && !isFetching) {
    return (
      <div className="rounded-lg bg-gray-50 py-16 text-center dark:bg-gray-800">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Нет данных для отображения.
        </p>
      </div>
    )
  }

  return (
    <div className="relative space-y-4">
      {isFetching && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10">
          <Spinner />
        </div>
      )}

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        onPaginationChange={handlePaginationChange}
        pagination={pagination}
        rowCount={data?.meta.total ?? 0}
        manualPagination={true}
        handleDelete={() => undefined}
      />
    </div>
  )
}
