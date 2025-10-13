// src/widgets/filters-sidebar/_ui/category-filter.tsx
'use client'

import { ProductCategoryWithParents } from '@/entities/category'
import { FilterAccordion } from './filter-accordion'
import { cn } from '@/shared/ui/utils'
import { useFilters } from '@/shared/providers/Filters'
import { getSidebarCategories } from '@/features/get-sidebar-categories'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type CategoryFilterProps = {
  allCategories: ProductCategoryWithParents[]
  pageTitle?: string
}

export function CategoryFilter({ allCategories, pageTitle }: CategoryFilterProps) {
  const { filters, setFilter } = useFilters()
  const activeCategorySlug = filters.category

  // Используем getSidebarCategories для получения нужных категорий
  const { categories, title } = getSidebarCategories(allCategories, activeCategorySlug)

  // Найдем активную категорию для получения ссылки на родителя
  const activeCategory = activeCategorySlug
    ? allCategories.find((cat) => cat.slug === activeCategorySlug)
    : null

  // Получим родительскую категорию, если есть
  let parentCategory = null
  if (activeCategory && activeCategory.parent) {
    if (typeof activeCategory.parent === 'object') {
      parentCategory = activeCategory.parent
    } else {
      parentCategory = allCategories.find((cat) => String(cat.id) === String(activeCategory.parent))
    }
  }

  const handleCategoryClick = (slug: string) => {
    setFilter('category', slug)
  }

  return (
    <div className="border-b border-border pb-2">
      {parentCategory && (
        <div className="mb-3">
          <Link
            href={`/products${parentCategory.slug ? `?category=${parentCategory.slug}` : ''}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Назад к {parentCategory.title}</span>
          </Link>
        </div>
      )}
      <FilterAccordion title={pageTitle || title} defaultVisibleCount={10}>
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              onClick={() => handleCategoryClick(cat.slug!)}
              className={cn(
                'hover:text-destructive text-sm text-left',
                activeCategorySlug === cat.slug ? 'text-destructive font-medium' : '',
              )}
            >
              {cat.title}
            </button>
          </li>
        ))}
      </FilterAccordion>
    </div>
  )
}
