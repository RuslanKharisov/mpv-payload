'use client'

import { useMemo } from 'react'
import { FilterAccordion } from './filter-accordion'
import { Brand } from '@/payload-types'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'
import { useFilters } from '@/shared/providers/Filters'
import { Badge } from '@/shared/ui/badge'
import { toDomId } from '@/shared/utilities/toDomId'
import { cn } from '@/shared/ui/utils'

type BrandFilterProps = {
  brands: Brand[]
}

// src\widgets\filters-sidebar\_ui\brand-filter.tsx

export function BrandFilter({ brands }: BrandFilterProps) {
  const { filters, setFilter } = useFilters()

  const brandItems = useMemo(() => {
    return (
      brands
        .map((brand) => {
          const isChecked = filters.brands?.includes(brand.slug!) || false
          const productCount = (brand as any).productCount || 0
          return { brand, isChecked, productCount }
        })
        // СОРТИРОВКА: Сначала те, где больше товаров. Если поровну — по алфавиту.
        .sort((a, b) => {
          if (b.productCount !== a.productCount) {
            return b.productCount - a.productCount
          }
          return a.brand.name.localeCompare(b.brand.name)
        })
    )
  }, [brands, filters.brands])

  return (
    <FilterAccordion title="Бренды" defaultVisibleCount={10}>
      {brandItems.map(({ brand, isChecked, productCount }) => (
        <li key={brand.id} className="flex items-center justify-between group">
          <div className="flex items-center gap-3 flex-1">
            <Checkbox
              id={`brand-${toDomId(brand.slug ?? brand.name)}`}
              checked={isChecked}
              onCheckedChange={() => {
                if (brand.slug) {
                  const current = filters.brands || []
                  const next = current.includes(brand.slug)
                    ? current.filter((c) => c !== brand.slug)
                    : [...current, brand.slug]
                  setFilter('brands', next.length > 0 ? next : undefined)
                }
              }}
            />
            <Label
              htmlFor={`brand-${toDomId(brand.slug ?? brand.name)}`}
              className={cn(
                'cursor-pointer font-light flex-1 text-sm transition-colors',
                productCount === 0 ? 'text-muted-foreground/60' : 'text-foreground',
              )}
            >
              {brand.name}
            </Label>
          </div>
          {productCount > 0 && (
            <Badge
              variant="secondary"
              className="rounded-xl font-normal opacity-80 group-hover:opacity-100"
            >
              {productCount}
            </Badge>
          )}
        </li>
      ))}
    </FilterAccordion>
  )
}
