'use client'

import { useRouter } from 'next/navigation'
import { Arrow } from '../icons/arrow'
import { Skeleton } from './skeleton'
import { getRouteProductCategoriesPaginated } from '../utilities/routes'

export const PaginationSkeleton = () => (
  <div className="mt-6 flex w-fit items-center gap-1 rounded-[4px] border border-gray-300 px-3 py-1.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-[32px] w-[32px] rounded-[4px] border border-gray-200" />
    ))}
  </div>
)

type ServerVariant = { variant: 'server'; onPageChange?: never }
type ClientVariant = { variant: 'client'; onPageChange: (page: number) => void }

type PaginationProps = {
  page: number
  totalPages: number
  isLoading?: boolean
} & (ServerVariant | ClientVariant)

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  isLoading,
  variant,
}) => {
  const router = useRouter()

  const handlePageClick = (pageNum: number) => {
    if (isLoading || pageNum === page || pageNum < 1 || pageNum > totalPages) return

    if (variant === 'server') {
      router.push(getRouteProductCategoriesPaginated(pageNum))
    } else {
      onPageChange?.(pageNum)
    }
  }

  const getPagesToShow = (): (number | string)[] => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1)

    const pages: (number | string)[] = [1]

    if (page > 3) pages.push('...')

    const middlePages = [Math.max(2, page - 1), page, Math.min(totalPages - 1, page + 1)].filter(
      (p, i, arr) => arr.indexOf(p) === i && p > 1 && p < totalPages,
    )

    pages.push(...middlePages)

    if (page < totalPages - 2) pages.push('...')

    pages.push(totalPages)

    return pages
  }

  const pagesToShow = getPagesToShow()

  return (
    <div className="mb-4 flex w-fit items-center rounded-[4px] border border-gray-300">
      <button
        className="cursor-pointer px-3 py-1.5 disabled:opacity-50"
        disabled={page <= 1 || isLoading}
        onClick={() => handlePageClick(page - 1)}
      >
        <Arrow className="text-dark-grey" />
      </button>

      {pagesToShow.map((p, idx) =>
        p === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="text-dark-grey cursor-default border-x border-gray-300 px-3 py-1.5 text-[14px]"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            disabled={isLoading}
            className={`${
              p === page ? 'bg-black text-white' : 'text-dark-grey'
            } cursor-pointer border-x border-gray-300 px-3 py-1.5 text-[14px] leading-[150%] font-medium`}
            onClick={() => handlePageClick(p as number)}
          >
            {p}
          </button>
        ),
      )}

      <button
        className="rotate-180 cursor-pointer px-3 py-1.5 disabled:opacity-50"
        disabled={page >= totalPages || isLoading}
        onClick={() => handlePageClick(page + 1)}
      >
        <Arrow className="text-dark-grey" />
      </button>
    </div>
  )
}
