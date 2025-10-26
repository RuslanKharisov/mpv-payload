'use client'

import { cn } from '@/shared/utilities/ui'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination'

export const ProductsPagination: React.FC<{
  className?: string
  page: number
  totalPages: number
  route: string
}> = (props) => {
  const { className, page, totalPages, route } = props

  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  const searchParams = useSearchParams()

  // Генерация URL: берём *все* текущие searchParams и добавляем/заменяем page
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())

    // Устанавливаем нужный номер страницы
    params.set('page', String(pageNumber))

    // Возвращаем готовую строку URL
    return `/${route}?${params.toString()}`
  }

  return (
    <div className={cn('my-12', className)}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Link href={createPageURL(page - 1)} prefetch={false}>
              <PaginationPrevious
                aria-disabled={!hasPrevPage}
                tabIndex={!hasPrevPage ? -1 : undefined}
                className={!hasPrevPage ? 'pointer-events-none opacity-50' : undefined}
              />
            </Link>
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <Link href={createPageURL(page - 1)} prefetch={false}>
                <PaginationLink isActive={false}>{page - 1}</PaginationLink>
              </Link>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink href={createPageURL(page)} isActive>
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <Link href={createPageURL(page + 1)} prefetch={false}>
                <PaginationLink isActive={false}>{page + 1}</PaginationLink>
              </Link>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <Link href={createPageURL(page + 1)} prefetch={false}>
              <PaginationNext
                aria-disabled={!hasNextPage}
                tabIndex={!hasNextPage ? -1 : undefined}
                className={!hasNextPage ? 'pointer-events-none opacity-50' : undefined}
              />
            </Link>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
