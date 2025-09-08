'use client'

import { StockWithTenantAndCurrency } from '@/features/stock'
import { Button } from '@/shared/ui/button'

import { ColumnDef } from '@tanstack/react-table'

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
    accessorFn: (row) => row.currency.code,
    header: 'Цена',
  },
  {
    header: () => '',
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const stock = row.original
      return (
        <Button
          className="w-full text-xs"
          variant="outline"
          size="sm"
          onClick={() => console.log(stock.tenant.name)}
        >
          Запросить
        </Button>
      )
    },
  },
]
