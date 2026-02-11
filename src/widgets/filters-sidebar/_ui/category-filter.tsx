'use client'

import { useMemo } from 'react'
import { ProductCategoryWithParents } from '@/entities/category'
import { FilterAccordion } from './filter-accordion'
import { cn } from '@/shared/ui/utils' // проверьте путь (у вас было и ui/utils и utilities/ui)
import { useFilters } from '@/shared/providers/Filters'
import { getSidebarCategories } from '@/features/get-sidebar-categories'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'

type CategoryFilterProps = {
  allCategories: ProductCategoryWithParents[]
  pageTitle?: string
}

export function CategoryFilter({ allCategories, pageTitle }: CategoryFilterProps) {
  const { filters, setFilter } = useFilters()
  const activeCategorySlug = filters.category

  // 1. Логика определения отображаемых категорий (текущая глубина)
  const { categories, title } = useMemo(() => {
    return getSidebarCategories(allCategories, activeCategorySlug)
  }, [allCategories, activeCategorySlug])

  // 2. Подготовка элементов (БЕРЕМ ДАННЫЕ ИЗ ОБЪЕКТА)
  const categoryItems = useMemo(() => {
    return categories.map((category) => {
      const isActive = activeCategorySlug === category.slug
      // ВАЖНО: берем productCount, который пришел с сервера
      const count = category.productCount || 0

      return {
        category,
        isActive,
        productCount: count,
      }
    })
  }, [categories, activeCategorySlug])

  // 3. Логика кнопки "Назад" (без изменений)
  const activeCategory = useMemo(() => {
    return activeCategorySlug ? allCategories.find((cat) => cat.slug === activeCategorySlug) : null
  }, [allCategories, activeCategorySlug])

  const parentCategory = useMemo(() => {
    if (!activeCategory || !activeCategory.parent) return null
    return typeof activeCategory.parent === 'object'
      ? activeCategory.parent
      : allCategories.find((cat) => String(cat.id) === String(activeCategory.parent))
  }, [allCategories, activeCategory])

  return (
    <div className="border-b border-border pb-2">
      {parentCategory && (
        <div className="mb-3">
          <Link
            href={`/products${parentCategory.slug ? `?category=${parentCategory.slug}` : ''}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setFilter('category', parentCategory.slug || '')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Назад к {parentCategory.title}</span>
          </Link>
        </div>
      )}

      <div
        key={activeCategorySlug}
        className="animate-in fade-in slide-in-from-left-2 duration-500"
      >
        <FilterAccordion title={pageTitle || title} defaultVisibleCount={10}>
          <ul className="space-y-1">
            {categoryItems.map(({ category, isActive, productCount }) => (
              <li key={category.id} className="flex items-center justify-between">
                <button
                  onClick={() => setFilter('category', category.slug!)}
                  className={cn(
                    'hover:text-destructive text-sm text-left flex-1 transition-colors',
                    isActive ? 'text-destructive font-medium' : '',
                  )}
                >
                  {category.title}
                </button>
                {productCount > 0 && (
                  <Badge variant="secondary" className="rounded-xl ml-2 font-normal">
                    {productCount}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </FilterAccordion>
      </div>
    </div>
  )
}
