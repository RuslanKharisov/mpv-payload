'use client'

import { useMemo } from 'react'
import { Suspense, useState } from 'react'
import { cn } from '@/shared/utilities/ui'
import { ArrowLeft, SlidersHorizontal, XIcon } from 'lucide-react'
import { ProductCategoryWithParents } from '@/entities/category'
import { CategoryFilter } from './category-filter'
import { BrandFilter } from './brand-filter'
import { Brand } from '@/payload-types'
import { ClearFiltersButton } from './clear-filters-button'
import Link from 'next/link'
import { ConditionFilter } from './condition-filter'
import { CityFilter } from './city-filter'
import { RegionFilter } from './region-filter'

type FiltersSidebarProps = {
  allCategories: ProductCategoryWithParents[]
  brands?: Brand[]
  regions?: string[]
  cities?: string[]
  pageTitle: string
}

export function FiltersSidebar({
  allCategories,
  brands = [],
  regions = [],
  cities = [],
  pageTitle,
}: FiltersSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Используем useMemo для мемоизации вычислений
  const hasBrands = useMemo(() => brands.length > 0, [brands])

  return (
    <>
      <button
        className="z-50 w-full p-2 md:hidden flex justify-end "
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Меню"
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <SlidersHorizontal className="h-6 w-6" />}
      </button>
      <div
        className={cn(
          'z-40 bg-background -translate-x-[200%] absolute left-0 h-full w-full min-w-[fit-content] md:max-w-[324px] space-y-4 md:relative md:translate-x-0 md:min-w-[270px] duration-300',
          isOpen ? 'translate-x-0 w-full' : '-translate-x-full',
        )}
      >
        <div className="p-4 max-w-full bg-card space-y-6 h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] sticky top-4 overflow-y-auto">
          <Suspense>
            <ClearFiltersButton />
          </Suspense>
          <Link
            href="/products"
            className="flex items-center gap-2 font-medium text-ring text-base"
          >
            <ArrowLeft /> <span>Вернуться</span>
          </Link>
          <Suspense>
            <CategoryFilter allCategories={allCategories} pageTitle={pageTitle} />
          </Suspense>
          {hasBrands && (
            <Suspense>
              <BrandFilter brands={brands} />
            </Suspense>
          )}
          <Suspense>
            <ConditionFilter />
          </Suspense>
          <Suspense>
            <RegionFilter regions={regions} />
          </Suspense>
          <Suspense>
            <CityFilter cities={cities} />
          </Suspense>
        </div>
      </div>
    </>
  )
}
