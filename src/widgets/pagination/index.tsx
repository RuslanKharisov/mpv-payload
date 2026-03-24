'use client'

import { cn } from '@/shared/utilities/ui'
import { useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination'

type ListPaginationProps = {
  className?: string
  page: number
  totalPages: number
  route: string // 'products' | 'suppliers' и т.п.
}

export const ListPagination: React.FC<ListPaginationProps> = ({
  className,
  page,
  totalPages,
  route,
}) => {
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(pageNumber))
    return `/${route}?${params.toString()}`
  }

  return (
    <div className={cn('my-12', className)}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {hasPrevPage ? (
              <PaginationPrevious href={createPageURL(page - 1)} />
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
              <PaginationLink href={createPageURL(page - 1)}>{page - 1}</PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
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
            {hasNextPage ? (
              <PaginationNext href={createPageURL(page + 1)} />
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
