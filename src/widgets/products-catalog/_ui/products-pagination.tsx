'use client'

import { cn } from '@/shared/utilities/ui'
import React from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination'

// ИСПРАВЛЕНО: Обновляем типы пропсов
export const ProductsPagination: React.FC<{
  className?: string
  page: number
  totalPages: number
  route: string
  extraParams?: Record<string, any>
}> = (props) => {
  const { className, page, totalPages, route, extraParams = {} } = props

  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  // Генерация URL
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams()

    // 1. Добавляем все существующие фильтры из extraParams
    Object.entries(extraParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value))
      }
    })

    // 2. Устанавливаем нужный номер страницы
    params.set('page', String(pageNumber))

    // 3. Возвращаем готовую строку URL
    return `/${route}?${params.toString()}`
  }

  return (
    <div className={cn('my-12', className)}>
      <Pagination>
        <PaginationContent>
          {/* ИСПОЛЬЗУЕМ `href` ВМЕСТО `onClick` */}
          <PaginationItem>
            <PaginationPrevious
              href={createPageURL(page - 1)}
              aria-disabled={!hasPrevPage}
              tabIndex={!hasPrevPage ? -1 : undefined}
              className={!hasPrevPage ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink href={createPageURL(page - 1)}>{page - 1}</PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink href={createPageURL(page)} isActive>
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink href={createPageURL(page + 1)}>{page + 1}</PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href={createPageURL(page + 1)}
              aria-disabled={!hasNextPage}
              tabIndex={!hasNextPage ? -1 : undefined}
              className={!hasNextPage ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
