'use client'

import { useFilters } from '@/shared/providers/Filters'
import { FilterAccordion } from './filter-accordion'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'

type CityFilterProps = {
  cities?: string[]
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

  return (
    <FilterAccordion title="Город" defaultVisibleCount={10}>
      {cities.map((cityName) => (
        <li key={cityName} className="flex items-center gap-3">
          <Checkbox
            id={`city-${cityName}`}
            checked={currentCity === cityName}
            onCheckedChange={() => toggleCity(cityName)}
          />
          <Label htmlFor={`city-${cityName}`} className="cursor-pointer font-light">
            {cityName}
          </Label>
        </li>
      ))}
    </FilterAccordion>
  )
}
