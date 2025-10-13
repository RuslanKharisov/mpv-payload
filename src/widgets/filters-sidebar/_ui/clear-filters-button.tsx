'use client'

import { Button } from '@/shared/ui/button'
import { useFilters } from '@/shared/providers/Filters'

export function ClearFiltersButton() {
  const { filters, resetFilters } = useFilters()

  // Определяем, активен ли хотя бы один фильтр
  const hasActiveFilters = Object.keys(filters).some((key) => {
    const value = filters[key as keyof typeof filters]
    if (value === undefined) return false
    if (Array.isArray(value) && value.length === 0) return false
    return true
  })

  // Если фильтров нет, ничего не рендерим
  if (!hasActiveFilters) {
    return null
  }

  return (
    <Button variant="outline" className="w-fit" onClick={resetFilters}>
      Очистить все фильтры
    </Button>
  )
}
