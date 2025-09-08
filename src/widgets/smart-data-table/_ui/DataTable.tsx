'use client'

import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/shared/ui/table'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  OnChangeFn,
  RowData,
} from '@tanstack/react-table'
import React from 'react'
import { DataTablePagination } from './DataTablePagination'
import { PaginationState } from '../model/pagination-state'
import { Spinner } from '@/shared/ui/spinner'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    deleteData: (id: string) => void
    updateData: (id: string) => void
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  rowCount: number
  pagination: PaginationState
  manualPagination?: boolean
  onPaginationChange?: OnChangeFn<PaginationState>
  onFilteringChange?: (newFilters: ColumnFiltersState) => void
  handleDelete?: (id: string) => void
  handleUpdate?: (id: string | number) => void
  initialFilters?: ColumnFiltersState // Добавляем initialFilters
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
  rowCount,
  pagination,
  manualPagination,
  onPaginationChange,
  handleDelete,
  handleUpdate,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    columns,
    data,
    manualPagination: manualPagination,
    manualFiltering: true,
    pageCount: manualPagination ? Math.ceil(rowCount / pagination.pageSize) : undefined,
    state: { pagination },
    getCoreRowModel: getCoreRowModel(),
    meta: {
      deleteData: (id: string) => {
        if (typeof handleDelete === 'function') {
          handleDelete(id)
        } else {
          console.warn('handleDelete function was not provided')
        }
      },
      updateData: (id: string | number) => {
        if (typeof handleUpdate === 'function') {
          const numericId = typeof id === 'string' ? parseInt(id, 10) : id
          if (!isNaN(numericId)) {
            handleUpdate(numericId)
          } else {
            console.error('Invalid ID format:', id)
          }
        } else {
          console.warn('handleUpdate function was not provided')
        }
      },
    },
    onPaginationChange,
  })

  return (
    <div className="mx-auto w-full">
      <DataTablePagination table={table} totalCount={rowCount} />
      {loading ? (
        <div className="mt-20">
          <Spinner />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table?.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row?.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-2xl font-bold"
                  ></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
