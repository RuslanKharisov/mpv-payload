'use client'

import { useFilters } from '@/shared/providers/Filters'
import { Badge } from '@/shared/ui/badge'
import { Checkbox } from '@/shared/ui/checkbox'
import { Label } from '@/shared/ui/label'
import { useAllFilterStats } from '@/shared/utilities/getProductCounts'
import { toDomId } from '@/shared/utilities/toDomId'
import { useMemo } from 'react'
import { FilterAccordion } from './filter-accordion'

type CityFilterProps = {
  cities?: string[]
}

// Отдельный компонент для каждого города
function CityItem({
  cityName,
  isChecked,
  toggleCity,
  productCount,
}: {
  cityName: string
  isChecked: boolean
  toggleCity: (value: string) => void
  productCount: number
}) {
  const safeId = `city-${toDomId(cityName)}`
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox id={safeId} checked={isChecked} onCheckedChange={() => toggleCity(cityName)} />
        <Label htmlFor={safeId} className="cursor-pointer font-light flex-1">
          {cityName}
        </Label>
      </div>
      {productCount !== 0 && (
        <Badge variant="secondary" className="rounded-xl">
          {productCount}
        </Badge>
      )}
    </li>
  )
}

export function CityFilter({ cities = [] }: CityFilterProps) {
  const { filters, setFilter } = useFilters()
  const currentCity = filters.city

  const { stats } = useAllFilterStats()

  const toggleCity = (value: string) => {
    // В B2B часто ищут в одном городе, поэтому оставляем логику выбора одного значения
    setFilter('city', currentCity === value ? undefined : value)
  }

  const cityItems = useMemo(() => {
    return (
      cities
        .map((cityName) => {
          const isChecked = currentCity === cityName
          const productCount = stats.cities[cityName] || 0
          return { cityName, isChecked, productCount }
        })
        // СОРТИРОВКА: сначала города, где ЕСТЬ товары, затем по алфавиту
        .sort((a, b) => {
          if (b.productCount !== a.productCount) {
            return b.productCount - a.productCount
          }
          return a.cityName.localeCompare(b.cityName)
        })
    )
  }, [cities, currentCity, stats.cities])

  // Если данных еще нет, можно показать легкий скелетон или просто скрыть Badge
  return (
    <FilterAccordion title="Город" defaultVisibleCount={10}>
      {cityItems.map(({ cityName, isChecked, productCount }) => (
        <CityItem
          key={cityName}
          cityName={cityName}
          isChecked={isChecked}
          toggleCity={toggleCity}
          productCount={productCount}
        />
      ))}
    </FilterAccordion>
  )
}
