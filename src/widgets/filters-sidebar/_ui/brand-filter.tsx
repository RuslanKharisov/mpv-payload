'use client'

import { FilterAccordion } from './filter-accordion'
import { Brand } from '@/payload-types'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'
import { useFilters } from '@/shared/providers/Filters'

type BrandFilterProps = {
  brands: Brand[]
}

export function BrandFilter({ brands }: BrandFilterProps) {
  const { filters, setFilter } = useFilters()

  const toggleBrand = (slug: string) => {
    const current = filters.brands || []
    const next = current.includes(slug) ? current.filter((c) => c !== slug) : [...current, slug]
    setFilter('brands', next.length > 0 ? next : undefined)
  }

  return (
    <FilterAccordion title="Бренды" defaultVisibleCount={10}>
      {brands.map((brand) => {
        const isChecked = filters.brands ? filters.brands.includes(brand.slug!) : false
        return (
          <li key={brand.id} className="flex items-center gap-3">
            <Checkbox
              id={`brand-${brand.slug}`}
              name="brands"
              checked={isChecked}
              onCheckedChange={() => toggleBrand(brand.slug!)}
            />
            <Label htmlFor={`brand-${brand.slug}`} className="cursor-pointer font-light">
              {brand.name}
            </Label>
          </li>
        )
      })}
    </FilterAccordion>
  )
}
