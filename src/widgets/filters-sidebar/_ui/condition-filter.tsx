'use client'

import { useFilters } from '@/shared/providers/Filters'
import { Badge } from '@/shared/ui/badge'
import { Checkbox } from '@/shared/ui/checkbox'
import { Label } from '@/shared/ui/label'
import { useAllFilterStats } from '@/shared/utilities/getProductCounts'
import { toDomId } from '@/shared/utilities/toDomId'
import { useMemo } from 'react'
import { FilterAccordion } from './filter-accordion'

const CONDITIONS = [
  { value: 'НОВЫЙ С ЗАВОДА', label: 'Новый с завода' },
  { value: 'НОВЫЙ ИЗЛИШЕК', label: 'Новый излишек' },
  { value: 'Б/У', label: 'Б/У' },
  { value: 'ВОССТАНОВЛЕН', label: 'Восстановлен' },
]

// Отдельный компонент для каждого состояния (UI часть)
function ConditionItem({
  condition,
  isChecked,
  toggleCondition,
  productCount,
}: {
  condition: { value: string; label: string }
  isChecked: boolean
  toggleCondition: (value: string) => void
  productCount: number
}) {
  const safeId = `condition-${toDomId(condition.value)}`

  return (
    <li className="flex items-center justify-between group">
      <div className="flex items-center gap-3 flex-1 text-sm">
        <Checkbox
          id={safeId}
          checked={isChecked}
          onCheckedChange={() => toggleCondition(condition.value)}
        />
        <Label htmlFor={safeId} className="cursor-pointer font-light flex-1 transition-colors">
          {condition.label}
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

export function ConditionFilter() {
  const { filters, setFilter } = useFilters()
  const currentCondition = filters.condition

  // Берем данные из общего агрегатора (уже загружены City и Region фильтрами)
  const { stats } = useAllFilterStats()

  const toggleCondition = (value: string) => {
    setFilter('condition', currentCondition === value ? undefined : value)
  }

  // Подготавливаем данные для рендеринга с учетом статистики
  const conditionItems = useMemo(() => {
    return CONDITIONS.map((condition) => {
      const isChecked = currentCondition === condition.value
      // Данные берем из общего объекта stats.conditions
      const productCount = stats.conditions[condition.value] || 0

      return {
        condition,
        isChecked,
        productCount,
      }
    })
  }, [currentCondition, stats.conditions])

  return (
    <FilterAccordion title="Состояние" defaultVisibleCount={10}>
      <ul className="space-y-2">
        {conditionItems.map(({ condition, isChecked, productCount }) => (
          <ConditionItem
            key={condition.value}
            condition={condition}
            isChecked={isChecked}
            toggleCondition={toggleCondition}
            productCount={productCount}
          />
        ))}
      </ul>
    </FilterAccordion>
  )
}
