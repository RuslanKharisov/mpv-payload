'use client'

import { Button } from '@/shared/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

export function ClearFiltersButton() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Определяем, активен ли хотя бы один фильтр
  const hasActiveFilters =
    searchParams.has('category') || searchParams.has('brands') || searchParams.has('phrase')

  // Если фильтров нет, ничего не рендерим
  if (!hasActiveFilters) {
    return null
  }

  const handleClear = () => {
    // Просто переходим на базовый URL каталога без параметров
    router.push('/products', { scroll: false })
  }

  return (
    <Button variant="outline" className="w-fit" onClick={handleClear}>
      Очистить все фильтры
    </Button>
  )
}
