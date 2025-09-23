'use client'

import { Suspense, useState } from 'react'
import { cn } from '@/shared/utilities/ui'
import { ArrowLeft, SlidersHorizontal, XIcon } from 'lucide-react'
import { getSidebarCategories } from '@/features/get-sidebar-categories'
import { ProductCategoryWithParents } from '@/entities/category'
import { CategoryFilter } from './category-filter'
import { BrandFilter } from './brand-filter'
import { Brand } from '@/payload-types'
import { ClearFiltersButton } from './clear-filters-button'
import Link from 'next/link'

type FiltersSidebarProps = {
  allCategories: ProductCategoryWithParents[]
  activeCategorySlug?: string
  brands?: Brand[]
  selectedBrands?: string[]
  pageTitle?: string
}

export function FiltersSidebar({
  allCategories,
  activeCategorySlug,
  brands = [],
  selectedBrands = [],
  pageTitle,
}: FiltersSidebarProps) {
  const { categories, showAll } = getSidebarCategories(allCategories, activeCategorySlug)
  const [isOpen, setIsOpen] = useState(false)

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
        <div className="p-4 max-w-full bg-card space-y-6">
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
            <CategoryFilter
              categories={categories}
              activeCategorySlug={activeCategorySlug}
              pageTitle={pageTitle}
            />
          </Suspense>
          {brands.length > 0 && (
            <Suspense>
              <BrandFilter brands={brands} selected={selectedBrands} />
            </Suspense>
          )}
        </div>
      </div>
    </>
  )
}
