'use client'

import { useMemo, useCallback } from 'react'
import { useFilters } from '@/shared/providers/Filters'
import { FilterAccordion } from './filter-accordion'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'
import { toDomId } from '@/shared/utilities/toDomId'
import { useProductCountByCondition } from '@/shared/utilities/getProductCounts'
import { Badge } from '@/shared/ui/badge'

const CONDITIONS = [
  { value: 'НОВЫЙ С ЗАВОДА', label: 'Новый с завода' },
  { value: 'НОВЫЙ ИЗЛИШЕК', label: 'Новый излишек' },
  { value: 'Б/У', label: 'Б/У' },
  { value: 'ВОССТАНОВЛЕН', label: 'Восстановлен' },
]

// Отдельный компонент для каждого состояния, чтобы хуки вызывались корректно
function ConditionItem({
  condition,
  isChecked,
  toggleCondition,
}: {
  condition: { value: string; label: string }
  isChecked: boolean
  toggleCondition: (value: string) => void
}) {
  const productCount = useProductCountByCondition(condition.value)

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          id={`condition-${toDomId(condition.value)}`}
          checked={isChecked}
          onCheckedChange={() => toggleCondition(condition.value)}
        />
        <Label
          htmlFor={`condition-${toDomId(condition.value)}`}
          className="cursor-pointer font-light flex-1"
        >
          {condition.label}
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

export function ConditionFilter() {
  const { filters, setFilter } = useFilters()
  const currentCondition = filters.condition

  // Используем useCallback для мемоизации функции
  const toggleCondition = useCallback(
    (value: string) => {
      if (currentCondition === value) {
        setFilter('condition', undefined)
      } else {
        setFilter('condition', value)
      }
    },
    [currentCondition, setFilter],
  )

  // Используем useMemo для мемоизации вычислений
  const conditionItems = useMemo(() => {
    return CONDITIONS.map((cond) => ({
      condition: cond,
      isChecked: currentCondition === cond.value,
    }))
  }, [currentCondition])

  return (
    <FilterAccordion title="Состояние" defaultVisibleCount={10}>
      {conditionItems.map(({ condition, isChecked }) => (
        <ConditionItem
          key={condition.value}
          condition={condition}
          isChecked={isChecked}
          toggleCondition={toggleCondition}
        />
      ))}
    </FilterAccordion>
  )
}
