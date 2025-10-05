'use client'

import Link from 'next/link'
import { ProductCategoryWithParents } from '@/entities/category'
import { FilterAccordion } from './filter-accordion'
import { cn } from '@/shared/ui/utils'
import { useSearchParams } from 'next/navigation'

type CategoryFilterProps = {
  categories: ProductCategoryWithParents[]
  activeCategorySlug?: string
  pageTitle?: string
}

export function CategoryFilter({ categories, activeCategorySlug, pageTitle }: CategoryFilterProps) {
  const searchParams = useSearchParams()
  const createCategoryUrl = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('category', slug)

    params.delete('page')

    return `/products?${params.toString()}`
  }

  return (
    <FilterAccordion title={pageTitle} defaultVisibleCount={10}>
      {categories.map((cat) => (
        <li key={cat.id}>
          <Link
            href={createCategoryUrl(cat.slug!)}
            className={cn(
              'hover:text-destructive text-sm',
              activeCategorySlug === cat.slug ? 'text-destructive font-medium' : '',
            )}
          >
            {cat.title}
          </Link>
        </li>
      ))}
    </FilterAccordion>
  )
}
