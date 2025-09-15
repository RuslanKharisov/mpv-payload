'use client'

import { StockWithTenantAndCurrency } from '@/features/stock'
import { AddToCartCell } from '@/entities/stock/_ui/add-to-cart-cell'

import { ColumnDef } from '@tanstack/react-table'
import { formatNumberWithSpaces } from '@/shared/utilities/formatNumberWithSpaces'

export const ProductsTableColumns: ColumnDef<StockWithTenantAndCurrency>[] = [
  {
    accessorFn: (row) => row.tenant.name,
    header: 'Компания',
  },
  {
    accessorKey: 'quantity',
    header: 'Кол.',
    cell: ({ row, column }) => (
      <div data-title={column.columnDef.header as string}>
        <p className="text-wrap text-xs">{row.getValue('quantity')}</p>
      </div>
    ),
  },
  {
    accessorFn: (row) => formatNumberWithSpaces(row.price ?? ''),
    header: 'Цена',
  },
  {
    accessorFn: (row) => row.currency.code,
    header: 'Валюта',
  },
  {
    header: () => '',
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const stock = row.original
      return <AddToCartCell stock={stock} />
    },
  },
]
