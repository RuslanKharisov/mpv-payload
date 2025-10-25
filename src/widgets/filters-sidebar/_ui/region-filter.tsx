'use client'

import { useMemo, useCallback } from 'react'
import { useFilters } from '@/shared/providers/Filters'
import { FilterAccordion } from './filter-accordion'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'
import { useProductCountByRegion } from '@/shared/utilities/getProductCounts'
import { Badge } from '@/shared/ui/badge'

type RegionFilterProps = {
  regions?: string[]
}

// Отдельный компонент для каждого региона, чтобы хуки вызывались корректно
function RegionItem({
  regionName,
  isChecked,
  toggleRegion,
}: {
  regionName: string
  isChecked: boolean
  toggleRegion: (value: string) => void
}) {
  const productCount = useProductCountByRegion(regionName)

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          id={`region-${regionName}`}
          checked={isChecked}
          onCheckedChange={() => toggleRegion(regionName)}
        />
        <Label htmlFor={`region-${regionName}`} className="cursor-pointer font-light flex-1">
          {regionName}
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

export function RegionFilter({ regions = [] }: RegionFilterProps) {
  const { filters, setFilter } = useFilters()
  const currentRegion = filters.region

  // Используем useCallback для мемоизации функции
  const toggleRegion = useCallback(
    (value: string) => {
      if (currentRegion === value) {
        setFilter('region', undefined)
      } else {
        setFilter('region', value)
      }
    },
    [currentRegion, setFilter],
  )

  // Используем useMemo для мемоизации вычислений
  const regionItems = useMemo(() => {
    return regions.map((regionName) => ({
      regionName,
      isChecked: currentRegion === regionName,
    }))
  }, [regions, currentRegion])

  return (
    <FilterAccordion title="Регион" defaultVisibleCount={10}>
      {regionItems.map(({ regionName, isChecked }) => (
        <RegionItem
          key={regionName}
          regionName={regionName}
          isChecked={isChecked}
          toggleRegion={toggleRegion}
        />
      ))}
    </FilterAccordion>
  )
}
