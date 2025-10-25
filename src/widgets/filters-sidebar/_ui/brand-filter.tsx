'use client'

import { useMemo, useCallback } from 'react'
import { FilterAccordion } from './filter-accordion'
import { Brand } from '@/payload-types'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'
import { useFilters } from '@/shared/providers/Filters'
import { useProductCountByBrand } from '@/shared/utilities/getProductCounts'
import { Badge } from '@/shared/ui/badge'

type BrandFilterProps = {
  brands: Brand[]
}

// Отдельный компонент для каждого бренда, чтобы хуки вызывались корректно
function BrandItem({
  brand,
  isChecked,
  toggleBrand,
}: {
  brand: Brand
  isChecked: boolean
  toggleBrand: (slug: string) => void
}) {
  const productQuantity = useProductCountByBrand(brand?.id || 0)

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          id={`brand-${brand.slug}`}
          name="brands"
          checked={isChecked}
          onCheckedChange={() => toggleBrand(brand.slug!)}
        />
        <Label htmlFor={`brand-${brand.slug}`} className="cursor-pointer font-light flex-1">
          {brand.name}
        </Label>
      </div>
      {productQuantity !== 0 && (
        <Badge variant="destructive" className="rounded-xl">
          {productQuantity}
        </Badge>
      )}
    </li>
  )
}

export function BrandFilter({ brands }: BrandFilterProps) {
  const { filters, setFilter } = useFilters()

  // Используем useCallback для мемоизации функции
  const toggleBrand = useCallback(
    (slug: string) => {
      const current = filters.brands || []
      const next = current.includes(slug) ? current.filter((c) => c !== slug) : [...current, slug]
      setFilter('brands', next.length > 0 ? next : undefined)
    },
    [filters.brands, setFilter],
  )

  // Используем useMemo для мемоизации вычислений
  const brandItems = useMemo(() => {
    return brands.map((brand) => {
      const isChecked = filters.brands ? filters.brands.includes(brand.slug!) : false
      return {
        brand,
        isChecked,
      }
    })
  }, [brands, filters.brands])

  return (
    <FilterAccordion title="Бренды" defaultVisibleCount={10}>
      {brandItems.map(({ brand, isChecked }) => (
        <BrandItem key={brand.id} brand={brand} isChecked={isChecked} toggleBrand={toggleBrand} />
      ))}
    </FilterAccordion>
  )
}
