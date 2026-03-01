'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/widgets/smart-data-table'
import { Spinner } from '@/shared/ui/spinner'
import { Tenant, Stock } from '@/payload-types'
import { getTenantStocksPublic } from '@/entities/stock/api/get-tenant-stocks-public'
import { Button } from '@/shared/ui/button'
import { useCart } from '@/features/cart/cart-provider'
import type { NormalizedCartItem } from '@/entities/cart'
import type { PaginationState, OnChangeFn, ColumnDef } from '@tanstack/react-table'

interface LocalWarehousesPublicProps {
  supplier: Tenant
  filters: {
    sku: string
    description: string
  }
}

export function LocalWarehousesPublic({ supplier, filters }: LocalWarehousesPublicProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const { data, isFetching } = useQuery({
    queryKey: [
      'local-stocks-public',
      supplier.id,
      pagination.pageIndex,
      pagination.pageSize,
      filters.sku,
      filters.description,
    ],
    queryFn: async () => {
      return getTenantStocksPublic({
        tenantId: supplier.id,
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        filters: {
          sku: filters.sku,
          description: filters.description,
        },
      })
    },
    placeholderData: (previousData) => previousData,
  })

  const { addToCart } = useCart()

  const handlePaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    setPagination((old) => {
      const newValue = typeof updaterOrValue === 'function' ? updaterOrValue(old) : updaterOrValue
      return newValue
    })
  }

  // Маппер для локальных складов
  const mapLocalStockToCartItem = (stock: Stock, supplier: Tenant): NormalizedCartItem => {
    const product =
      typeof stock.product === 'object' && stock.product !== null ? stock.product : null
    const warehouse =
      typeof stock.warehouse === 'object' && stock.warehouse !== null ? stock.warehouse : null
    const currency =
      typeof stock.currency === 'object' && stock.currency !== null ? stock.currency : null
    const brand =
      typeof product?.brand === 'object' && product?.brand !== null ? product.brand : null

    return {
      id: stock.id.toString(),
      sku: product?.sku || '',
      description: product?.shortDescription || product?.name || '',
      imageUrl: '/images/placeholder.webp',
      brand: brand?.name,
      supplierName: supplier.name,
      supplierEmail: supplier.requestEmail,
      price: stock.price ?? 0,
      currencyCode: currency?.code || 'RUB',
      availableQuantity: stock.quantity,
      originalItem: stock,
      source: 'local',
      warehouse: warehouse?.title,
    }
  }

  const handleAddToCart = (stock: Stock) => {
    const cartItem = mapLocalStockToCartItem(stock, supplier)
    addToCart(cartItem, 1)
  }

  // Колонки для локальных остатков
  const columns: ColumnDef<Stock>[] = [
    {
      accessorKey: 'product.name',
      header: 'Наименование',
      cell: ({ row }) => {
        const product = row.original.product
        const productName = typeof product === 'object' && product !== null ? product.name : '-'
        return <p className="text-xs">{productName}</p>
      },
    },
    {
      accessorKey: 'product.sku',
      header: 'Артикул',
      cell: ({ row }) => {
        const product = row.original.product
        const productSku = typeof product === 'object' && product !== null ? product.sku : '-'
        return <p className="text-xs">{productSku}</p>
      },
    },
    {
      accessorKey: 'warehouse.title',
      header: 'Склад',
      cell: ({ row }) => {
        const warehouse = row.original.warehouse
        const warehouseTitle =
          typeof warehouse === 'object' && warehouse !== null ? warehouse.title : '-'
        return <p className="text-xs">{warehouseTitle}</p>
      },
    },
    {
      accessorKey: 'quantity',
      header: 'Количество',
      cell: ({ row }) => <p className="text-xs">{row.getValue('quantity')}</p>,
    },
    {
      header: '',
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <Button
          className="w-full text-xs"
          variant="outline"
          size="sm"
          onClick={() => handleAddToCart(row.original)}
        >
          В корзину
        </Button>
      ),
    },
  ]

  if (!data?.docs?.length && !isFetching) {
    return (
      <div className="rounded-lg bg-gray-50 py-16 text-center dark:bg-gray-800">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Нет данных о локальных остатках.
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
        data={data?.docs ?? []}
        onPaginationChange={handlePaginationChange}
        pagination={pagination}
        rowCount={data?.totalDocs ?? 0}
        manualPagination={true}
        handleDelete={() => undefined}
      />
    </div>
  )
}
