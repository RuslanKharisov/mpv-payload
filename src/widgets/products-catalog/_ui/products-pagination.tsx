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

  // Generate URL: take *all* current searchParams and add/replace page
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())

    // Set the desired page numbe
    params.set('page', String(pageNumber))

    // Return the complete URL string
    return `/${route}?${params.toString()}`
  }

  return (
    <div className={cn('my-12', className)}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {hasPrevPage ? (
              <Link href={createPageURL(page - 1)} prefetch={false}>
                <PaginationPrevious />
              </Link>
            ) : (
              <PaginationPrevious
                aria-disabled={true}
                tabIndex={-1}
                className="pointer-events-none opacity-50"
              />
            )}
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
            <PaginationLink isActive>{page}</PaginationLink>
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
            {hasNextPage ? (
              <Link href={createPageURL(page + 1)} prefetch={false}>
                <PaginationNext />
              </Link>
            ) : (
              <PaginationNext
                aria-disabled={true}
                tabIndex={-1}
                className="pointer-events-none opacity-50"
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
