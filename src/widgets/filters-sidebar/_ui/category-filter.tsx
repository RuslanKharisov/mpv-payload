'use client'

import { useMemo } from 'react'
import { ProductCategoryWithParents } from '@/entities/category'
import { FilterAccordion } from './filter-accordion'
import { cn } from '@/shared/ui/utils'
import { useFilters } from '@/shared/providers/Filters'
import { getSidebarCategories } from '@/features/get-sidebar-categories'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useProductCountsByCategories } from '@/shared/utilities/getProductCounts'
import { Badge } from '@/shared/ui/badge'

type CategoryFilterProps = {
  allCategories: ProductCategoryWithParents[]
  pageTitle?: string
}

// Отдельный компонент для каждой категории
function CategoryItem({
  category,
  isActive,
  handleCategoryClick,
  productCount,
}: {
  category: ProductCategoryWithParents
  isActive: boolean
  handleCategoryClick: (slug: string) => void
  productCount: number
}) {
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
        <Badge variant="secondary" className="rounded-xl ml-2">
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

  // Получаем ID всех категорий для bulk запроса
  const categoryIds = useMemo(() => {
    return categories.map((category) => category.id)
  }, [categories])

  // Используем bulk хук для получения количества продуктов для всех категорий
  const categoryCounts = useProductCountsByCategories(categoryIds)

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

  const handleCategoryClick = (slug: string) => {
    setFilter('category', slug)
  }

  // Подготавливаем данные для рендеринга
  const categoryItems = useMemo(() => {
    return categories.map((category) => {
      const isActive = activeCategorySlug === category.slug
      const productCount = categoryCounts[category.id] || 0
      return {
        category,
        isActive,
        productCount,
      }
    })
  }, [categories, activeCategorySlug, categoryCounts])

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
        {categoryItems.map(({ category, isActive, productCount }) => (
          <CategoryItem
            key={category.id}
            category={category}
            isActive={isActive}
            handleCategoryClick={handleCategoryClick}
            productCount={productCount}
          />
        ))}
      </FilterAccordion>
    </div>
  )
}
