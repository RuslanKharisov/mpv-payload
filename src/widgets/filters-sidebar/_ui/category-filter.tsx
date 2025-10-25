'use client'

import { useMemo, useCallback } from 'react'
import { ProductCategoryWithParents } from '@/entities/category'
import { FilterAccordion } from './filter-accordion'
import { cn } from '@/shared/ui/utils'
import { useFilters } from '@/shared/providers/Filters'
import { getSidebarCategories } from '@/features/get-sidebar-categories'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useProductCountByCategory } from '@/shared/utilities/getProductCounts'
import { Badge } from '@/shared/ui/badge'

type CategoryFilterProps = {
  allCategories: ProductCategoryWithParents[]
  pageTitle?: string
}

// Отдельный компонент для каждой категории, чтобы хуки вызывались корректно
function CategoryItem({
  category,
  isActive,
  handleCategoryClick,
}: {
  category: ProductCategoryWithParents
  isActive: boolean
  handleCategoryClick: (slug: string) => void
}) {
  const productCount = useProductCountByCategory(category.id)

  return (
    <li className="flex items-center justify-between">
      <button
        onClick={() => handleCategoryClick(category.slug!)}
        className={cn(
          'hover:text-destructive text-sm text-left flex-1',
          isActive ? 'text-destructive font-medium' : '',
        )}
      >
        {category.title}
      </button>
      {productCount !== 0 && (
        <Badge variant="destructive" className="rounded-xl ml-2">
          {productCount}
        </Badge>
      )}
    </li>
  )
}

export function CategoryFilter({ allCategories, pageTitle }: CategoryFilterProps) {
  const { filters, setFilter } = useFilters()
  const activeCategorySlug = filters.category

  // Используем useMemo для мемоизации вычислений
  const { categories, title } = useMemo(() => {
    return getSidebarCategories(allCategories, activeCategorySlug)
  }, [allCategories, activeCategorySlug])

  // Найдем активную категорию для получения ссылки на родителя
  const activeCategory = useMemo(() => {
    return activeCategorySlug ? allCategories.find((cat) => cat.slug === activeCategorySlug) : null
  }, [allCategories, activeCategorySlug])

  // Получим родительскую категорию, если есть
  const parentCategory = useMemo(() => {
    if (!activeCategory || !activeCategory.parent) return null

    if (typeof activeCategory.parent === 'object') {
      return activeCategory.parent
    } else {
      return allCategories.find((cat) => String(cat.id) === String(activeCategory.parent))
    }
  }, [allCategories, activeCategory])

  // Используем useCallback для мемоизации функции
  const handleCategoryClick = useCallback(
    (slug: string) => {
      setFilter('category', slug)
    },
    [setFilter],
  )

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
          <CategoryItem
            key={cat.id}
            category={cat}
            isActive={activeCategorySlug === cat.slug}
            handleCategoryClick={handleCategoryClick}
          />
        ))}
      </FilterAccordion>
    </div>
  )
}
