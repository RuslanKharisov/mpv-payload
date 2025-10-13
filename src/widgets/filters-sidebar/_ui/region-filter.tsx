'use client'

import { useFilters } from '@/shared/providers/Filters'
import { FilterAccordion } from './filter-accordion'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'

type RegionFilterProps = {
  regions?: string[]
}

export function RegionFilter({ regions = [] }: RegionFilterProps) {
  const { filters, setFilter } = useFilters()
  const currentRegion = filters.region

  const toggleRegion = (value: string) => {
    if (currentRegion === value) {
      setFilter('region', undefined)
    } else {
      setFilter('region', value)
    }
  }

  return (
    <FilterAccordion title="Регион" defaultVisibleCount={10}>
      {regions.map((regionName) => (
        <li key={regionName} className="flex items-center gap-3">
          <Checkbox
            id={`region-${regionName}`}
            checked={currentRegion === regionName}
            onCheckedChange={() => toggleRegion(regionName)}
          />
          <Label htmlFor={`region-${regionName}`} className="cursor-pointer font-light">
            {regionName}
          </Label>
        </li>
      ))}
    </FilterAccordion>
  )
}
