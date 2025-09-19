'use client'

import Link from 'next/link'
import { ProductCategoryWithParents } from '@/entities/category'
import { FilterAccordion } from './filter-accordion'
import { cn } from '@/shared/ui/utils'

type CategoryFilterProps = {
  categories: ProductCategoryWithParents[]
  activeCategorySlug?: string
}

export function CategoryFilter({ categories, activeCategorySlug }: CategoryFilterProps) {
  return (
    <FilterAccordion title="Категории" defaultVisibleCount={10}>
      {categories.map((cat) => (
        <li key={cat.id}>
          <Link
            href={`/products?category=${cat.slug}`}
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
