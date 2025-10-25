'use client'

import { useMemo } from 'react'
import { FilterAccordion } from './filter-accordion'
import { Brand } from '@/payload-types'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'
import { useFilters } from '@/shared/providers/Filters'
import { useProductCountsByBrands } from '@/shared/utilities/getProductCounts'
import { Badge } from '@/shared/ui/badge'

type BrandFilterProps = {
  brands: Brand[]
}

// Отдельный компонент для каждого бренда
function BrandItem({
  brand,
  isChecked,
  toggleBrand,
  productCount,
}: {
  brand: Brand
  isChecked: boolean
  toggleBrand: (slug: string) => void
  productCount: number
}) {
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
      {productCount !== 0 && (
        <Badge variant="secondary" className="rounded-xl">
          {productCount}
        </Badge>
      )}
    </li>
  )
}

export function BrandFilter({ brands }: BrandFilterProps) {
  const { filters, setFilter } = useFilters()

  // Получаем ID всех брендов для bulk запроса
  const brandIds = useMemo(() => {
    return brands.map((brand) => brand.id)
  }, [brands])

  // Используем bulk хук для получения количества продуктов для всех брендов
  const brandCounts = useProductCountsByBrands(brandIds)

  const toggleBrand = (slug: string) => {
    const current = filters.brands || []
    const next = current.includes(slug) ? current.filter((c) => c !== slug) : [...current, slug]
    setFilter('brands', next.length > 0 ? next : undefined)
  }

  // Подготавливаем данные для рендеринга
  const brandItems = useMemo(() => {
    return brands.map((brand) => {
      const isChecked = filters.brands ? filters.brands.includes(brand.slug!) : false
      const productCount = brandCounts[brand.id] || 0
      return {
        brand,
        isChecked,
        productCount,
      }
    })
  }, [brands, filters.brands, brandCounts])

  return (
    <FilterAccordion title="Бренды" defaultVisibleCount={10}>
      {brandItems.map(({ brand, isChecked, productCount }) => (
        <BrandItem
          key={brand.id}
          brand={brand}
          isChecked={isChecked}
          toggleBrand={toggleBrand}
          productCount={productCount}
        />
      ))}
    </FilterAccordion>
  )
}
