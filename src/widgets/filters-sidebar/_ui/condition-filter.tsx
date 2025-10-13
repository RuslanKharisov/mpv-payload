'use client'

import { useFilters } from '@/shared/providers/Filters'
import { FilterAccordion } from './filter-accordion'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'
import { toDomId } from '@/shared/utilities/toDomId'

const CONDITIONS = [
  { value: 'НОВЫЙ С ЗАВОДА', label: 'Новый с завода' },
  { value: 'НОВЫЙ ИЗЛИШЕК', label: 'Новый излишек' },
  { value: 'Б/У', label: 'Б/У' },
  { value: 'ВОССТАНОВЛЕН', label: 'Восстановлен' },
]

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

  return (
    <FilterAccordion title="Состояние" defaultVisibleCount={10}>
      {CONDITIONS.map((cond) => (
        <li key={cond.value} className="flex items-center gap-3">
          <Checkbox
            id={`condition-${toDomId(cond.value)}`}
            checked={currentCondition === cond.value}
            onCheckedChange={() => toggleCondition(cond.value)}
          />
          <Label htmlFor={`condition-${toDomId(cond.value)}`} className="cursor-pointer font-light">
            {cond.label}
          </Label>
        </li>
      ))}
    </FilterAccordion>
  )
}
