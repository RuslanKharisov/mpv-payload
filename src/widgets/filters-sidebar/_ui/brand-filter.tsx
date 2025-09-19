'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FilterAccordion } from './filter-accordion'
import { Brand } from '@/payload-types'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'

type BrandFilterProps = {
  brands: Brand[]
  selected: string[]
}

export function BrandFilter({ brands, selected }: BrandFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const toggleBrand = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.get('brands')?.split(',') ?? []
    const next = current.includes(slug) ? current.filter((c) => c !== slug) : [...current, slug]

    if (next.length) {
      params.set('brands', next.join(','))
    } else {
      params.delete('brands')
    }

    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  return (
    <FilterAccordion title="Бренды" defaultVisibleCount={10}>
      {brands.map((brand) => (
        <li key={brand.id} className="flex items-center gap-3">
          <Checkbox
            id={`brand-${brand.slug}`}
            name="brands"
            checked={selected.includes(brand.slug!)}
            onCheckedChange={() => toggleBrand(brand.slug!)}
          />
          <Label htmlFor={`brand-${brand.slug}`} className="cursor-pointer font-light">
            {brand.name}
          </Label>
        </li>
      ))}
    </FilterAccordion>
  )
}
