'use client'

import { ColumnDef } from '@tanstack/react-table'
import { RemoteStock } from '../_domain/tstock-response'
import { AddToCartCell } from '../_ui/add-to-cart-cell'
import { Tenant } from '@/payload-types'

export const ProductsTableColumns = (supplier?: Tenant): ColumnDef<RemoteStock>[] => [
  {
    accessorKey: 'sku',
    header: 'Артикул',
    cell: ({ row, column }) => (
      <div data-title={column.columnDef.header as string}>
        <p className="text-xs">{row.getValue('sku')}</p>
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Описание',
    cell: ({ row, column }) => (
      <div className="" data-title={column.columnDef.header as string}>
        <p className="text-wrap text-xs line-clamp-2">{row.getValue('description')}</p>
      </div>
    ),
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
    accessorKey: 'brand',
    header: 'Вендор',
    cell: ({ row, column }) => (
      <div data-title={column.columnDef.header as string}>
        <p className="w-full text-wrap text-xs">{row.getValue('brand')}</p>
      </div>
    ),
  },
  {
    header: 'Скоро',
    id: 'delivery',
    enableHiding: false,
    cell: ({ row, column }) => {
      const newDeliveryQty1 = row.original.newDeliveryQty1
      const newDeliveryDate1 = row.original.newDeliveryDate1
        ? new Date(row.original.newDeliveryDate1).toLocaleDateString('ru-RU')
        : ''
      const newDeliveryQty2 = row.original.newDeliveryQty2
      const newDeliveryDate2 = row.original.newDeliveryDate2
        ? new Date(row.original.newDeliveryDate2).toLocaleDateString('ru-RU')
        : ''
      return (
        <div
          data-title={column.columnDef.header as string}
          className="flex flex-col md:gap-2 md:text-xs"
        >
          {newDeliveryQty1 && newDeliveryQty1 > 0 ? (
            <p>
              {newDeliveryQty1} шт. <span>{newDeliveryDate1}</span>
            </p>
          ) : (
            ''
          )}

          {newDeliveryQty2 && newDeliveryQty2 > 0 ? (
            <p>
              {newDeliveryQty2} шт. <span>{newDeliveryDate2}</span>
            </p>
          ) : (
            ''
          )}
        </div>
      )
    },
  },

  {
    header: () => '',
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const stock = row.original
      return supplier ? <AddToCartCell stock={stock} supplier={supplier} /> : null
    },
  },
]
