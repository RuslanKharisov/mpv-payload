'use client'

import { useMemo } from 'react'
import { useFilters } from '@/shared/providers/Filters'
import { FilterAccordion } from './filter-accordion'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'
import { useProductCountsByRegions } from '@/shared/utilities/getProductCounts'
import { Badge } from '@/shared/ui/badge'
import { toDomId } from '@/shared/utilities/toDomId'

type RegionFilterProps = {
  regions?: string[]
}

// Отдельный компонент для каждого региона
function RegionItem({
  regionName,
  isChecked,
  toggleRegion,
  productCount,
}: {
  regionName: string
  isChecked: boolean
  toggleRegion: (value: string) => void
  productCount: number
}) {
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          id={`region-${toDomId(regionName)}`}
          checked={isChecked}
          onCheckedChange={() => toggleRegion(regionName)}
        />
        <Label
          htmlFor={`region-${toDomId(regionName)}`}
          className="cursor-pointer font-light flex-1"
        >
          {regionName}
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

  // Используем bulk хук для получения количества продуктов для всех регионов
  const regionCounts = useProductCountsByRegions(regions)

  // Подготавливаем данные для рендеринга
  const regionItems = useMemo(() => {
    return regions.map((regionName) => {
      const isChecked = currentRegion === regionName
      const productCount = regionCounts[regionName] || 0
      return {
        regionName,
        isChecked,
        productCount,
      }
    })
  }, [regions, currentRegion, regionCounts])

  return (
    <FilterAccordion title="Регион" defaultVisibleCount={10}>
      {regionItems.map(({ regionName, isChecked, productCount }) => (
        <RegionItem
          key={regionName}
          regionName={regionName}
          isChecked={isChecked}
          toggleRegion={toggleRegion}
          productCount={productCount}
        />
      ))}
    </FilterAccordion>
  )
}
