'use client'

import { useMemo } from 'react'
import { useFilters } from '@/shared/providers/Filters'
import { FilterAccordion } from './filter-accordion'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'
import { useAllFilterStats } from '@/shared/utilities/getProductCounts'
import { Badge } from '@/shared/ui/badge'
import { toDomId } from '@/shared/utilities/toDomId'

type RegionFilterProps = {
  regions?: string[]
}

// Отдельный компонент для каждого региона (без изменений, кроме нейминга id)
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
  const safeId = `region-${toDomId(regionName)}`

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 text-sm">
        <Checkbox
          id={safeId}
          checked={isChecked}
          onCheckedChange={() => toggleRegion(regionName)}
        />
        <Label htmlFor={safeId} className="cursor-pointer font-light flex-1">
          {regionName}
        </Label>
      </div>
      {productCount > 0 && (
        <Badge variant="secondary" className="rounded-xl font-normal ml-2">
          {productCount}
        </Badge>
      )}
    </li>
  )
}

export function RegionFilter({ regions = [] }: RegionFilterProps) {
  const { filters, setFilter } = useFilters()
  const currentRegion = filters.region

  // Берем данные из общего агрегатора
  const { stats } = useAllFilterStats()

  const toggleRegion = (value: string) => {
    setFilter('region', currentRegion === value ? undefined : value)
  }

  // Подготавливаем данные с сортировкой
  const regionItems = useMemo(() => {
    return (
      regions
        .map((regionName) => {
          const isChecked = currentRegion === regionName
          const productCount = stats.regions[regionName] || 0
          return { regionName, isChecked, productCount }
        })
        // Сортировка: сначала регионы с товарами, затем по алфавиту
        .sort((a, b) => {
          if (b.productCount !== a.productCount) {
            return b.productCount - a.productCount
          }
          return a.regionName.localeCompare(b.regionName)
        })
    )
  }, [regions, currentRegion, stats.regions])

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
