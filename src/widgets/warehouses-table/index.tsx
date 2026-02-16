'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/widgets/smart-data-table'
import { Badge } from '@/shared/ui/badge'
import { UiWarehouse } from '@/entities/warehouse/model/types'

interface WarehousesTableProps {
  initialData: UiWarehouse[]
}

const columns: ColumnDef<UiWarehouse>[] = [
  {
    accessorKey: 'title',
    header: 'Название',
    cell: ({ row }) => {
      const warehouse = row.original
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{warehouse.title}</span>
          {warehouse.isDefault && (
            <Badge variant="secondary" className="text-xs">
              по умолчанию
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'address',
    header: 'Адрес',
    cell: ({ row }) => {
      const address = row.original.address
      return address ? (
        <span className="text-muted-foreground">{address}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
  },
  {
    accessorKey: 'capacity',
    header: 'Лимит позиций',
    cell: ({ row }) => {
      const capacity = row.original.capacity
      return capacity ? (
        <span>{capacity} поз.</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
  },
]

export function WarehousesTable({ initialData }: WarehousesTableProps) {
  return (
    <DataTable
      columns={columns}
      data={initialData}
      rowCount={initialData.length}
      pagination={{ pageIndex: 0, pageSize: initialData.length }}
      manualPagination={false}
    />
  )
}
