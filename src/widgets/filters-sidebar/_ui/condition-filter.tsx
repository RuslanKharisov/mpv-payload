'use client'

import { useMemo } from 'react'
import { useFilters } from '@/shared/providers/Filters'
import { FilterAccordion } from './filter-accordion'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'
import { toDomId } from '@/shared/utilities/toDomId'
import { useProductCountsByConditions } from '@/shared/utilities/getProductCounts'
import { Badge } from '@/shared/ui/badge'

const CONDITIONS = [
  { value: 'НОВЫЙ С ЗАВОДА', label: 'Новый с завода' },
  { value: 'НОВЫЙ ИЗЛИШЕК', label: 'Новый излишек' },
  { value: 'Б/У', label: 'Б/У' },
  { value: 'ВОССТАНОВЛЕН', label: 'Восстановлен' },
]

// Отдельный компонент для каждого состояния
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
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          id={safeId}
          checked={isChecked}
          onCheckedChange={() => toggleCondition(condition.value)}
        />
        <Label htmlFor={safeId} className="cursor-pointer font-light flex-1">
          {condition.label}
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

export function ConditionFilter() {
  const { filters, setFilter } = useFilters()
  const currentCondition = filters.condition

  const toggleCondition = (value: string) => {
    if (currentCondition === value) {
      setFilter('condition', undefined)
    } else {
      setFilter('condition', value)
    }
  }

  // Получаем все значения условий для bulk запроса
  const conditionValues = CONDITIONS.map((cond) => cond.value)

  // Используем bulk хук для получения количества продуктов для всех условий
  const conditionCounts = useProductCountsByConditions(conditionValues)

  // Подготавливаем данные для рендеринга
  const conditionItems = useMemo(() => {
    return CONDITIONS.map((condition) => {
      const isChecked = currentCondition === condition.value
      const productCount = conditionCounts[condition.value] || 0
      return {
        condition,
        isChecked,
        productCount,
      }
    })
  }, [currentCondition, conditionCounts])

  return (
    <FilterAccordion title="Состояние" defaultVisibleCount={10}>
      {conditionItems.map(({ condition, isChecked, productCount }) => (
        <ConditionItem
          key={condition.value}
          condition={condition}
          isChecked={isChecked}
          toggleCondition={toggleCondition}
          productCount={productCount}
        />
      ))}
    </FilterAccordion>
  )
}
