'use client'

import { useMemo, useCallback } from 'react'
import { useFilters } from '@/shared/providers/Filters'
import { FilterAccordion } from './filter-accordion'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'
import { useProductCountByCity } from '@/shared/utilities/getProductCounts'
import { Badge } from '@/shared/ui/badge'

type CityFilterProps = {
  cities?: string[]
}

// Отдельный компонент для каждого города, чтобы хуки вызывались корректно
function CityItem({
  cityName,
  isChecked,
  toggleCity,
}: {
  cityName: string
  isChecked: boolean
  toggleCity: (value: string) => void
}) {
  const productCount = useProductCountByCity(cityName)

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
        <Badge variant="destructive" className="rounded-xl">
          {productCount}
        </Badge>
      )}
    </li>
  )
}

export function CityFilter({ cities = [] }: CityFilterProps) {
  const { filters, setFilter } = useFilters()
  const currentCity = filters.city

  // Используем useCallback для мемоизации функции
  const toggleCity = useCallback(
    (value: string) => {
      if (currentCity === value) {
        setFilter('city', undefined)
      } else {
        setFilter('city', value)
      }
    },
    [currentCity, setFilter],
  )

  // Используем useMemo для мемоизации вычислений
  const cityItems = useMemo(() => {
    return cities.map((cityName) => ({
      cityName,
      isChecked: currentCity === cityName,
    }))
  }, [cities, currentCity])

  return (
    <FilterAccordion title="Город" defaultVisibleCount={10}>
      {cityItems.map(({ cityName, isChecked }) => (
        <CityItem
          key={cityName}
          cityName={cityName}
          isChecked={isChecked}
          toggleCity={toggleCity}
        />
      ))}
    </FilterAccordion>
  )
}
