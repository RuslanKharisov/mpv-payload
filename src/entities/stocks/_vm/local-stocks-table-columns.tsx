'use client'

import { ColumnDef } from '@tanstack/react-table'
import type { Stock, Product, Warehouse, Currency } from '@/payload-types'

// Type for Stock with populated relations
export type LocalStockRow = Stock & {
  product: Product
  warehouse?: Warehouse | null
  currency: Currency
}

export const LocalStocksTableColumns: ColumnDef<LocalStockRow>[] = [
  {
    id: 'sku',
    accessorFn: (row) => row.product?.sku ?? '-',
    header: 'Артикул',
    cell: ({ row }) => {
      const product = row.original.product
      return <span className="text-xs">{product?.sku ?? '-'}</span>
    },
  },
  {
    id: 'name',
    accessorFn: (row) => row.product?.name ?? '-',
    header: 'Наименование',
    cell: ({ row }) => {
      const product = row.original.product
      return <span className="text-wrap text-xs line-clamp-2">{product?.name ?? '-'}</span>
    },
  },
  {
    accessorKey: 'warehouse',
    header: 'Склад',
    cell: ({ row }) => {
      const warehouse = row.original.warehouse
      return <span className="text-xs">{warehouse?.title ?? '-'}</span>
    },
  },
  {
    accessorKey: 'city',
    header: 'Город',
    cell: ({ row }) => {
      const stock = row.original
      const warehouse = stock.warehouse

      // Try _city first, then warehouse.selectedAddressData.city
      let city = stock._city
      if (!city && warehouse?.selectedAddressData) {
        const addressData = warehouse.selectedAddressData
        if (typeof addressData === 'object' && addressData !== null && 'city' in addressData) {
          city = (addressData as { city?: string }).city
        }
      }

      return <span className="text-xs">{city ?? '-'}</span>
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Количество',
    cell: ({ row }) => {
      return <span className="text-xs">{row.original.quantity}</span>
    },
  },
  {
    accessorKey: 'price',
    header: 'Цена',
    cell: ({ row }) => {
      const price = row.original.price
      return <span className="text-xs">{price ?? '-'}</span>
    },
  },
  {
    accessorKey: 'currency',
    header: 'Валюта',
    cell: ({ row }) => {
      const currency = row.original.currency
      return <span className="text-xs">{currency?.code ?? '-'}</span>
    },
  },
  {
    accessorKey: 'condition',
    header: 'Состояние',
    cell: ({ row }) => {
      const condition = row.original.condition
      return <span className="text-xs">{condition ?? '-'}</span>
    },
  },
]
