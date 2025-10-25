'use client'

import { useMemo } from 'react'
import { useFilters } from '@/shared/providers/Filters'
import { FilterAccordion } from './filter-accordion'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'
import { useProductCountsByCities } from '@/shared/utilities/getProductCounts'
import { Badge } from '@/shared/ui/badge'

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
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          id={`city-${cityName}`}
          checked={isChecked}
          onCheckedChange={() => toggleCity(cityName)}
        />
        <Label htmlFor={`city-${cityName}`} className="cursor-pointer font-light flex-1">
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

  const toggleCity = (value: string) => {
    if (currentCity === value) {
      setFilter('city', undefined)
    } else {
      setFilter('city', value)
    }
  }

  // Используем bulk хук для получения количества продуктов для всех городов
  const cityCounts = useProductCountsByCities(cities)

  // Подготавливаем данные для рендеринга
  const cityItems = useMemo(() => {
    return cities.map((cityName) => {
      const isChecked = currentCity === cityName
      const productCount = cityCounts[cityName] || 0
      return {
        cityName,
        isChecked,
        productCount,
      }
    })
  }, [cities, currentCity, cityCounts])

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
