'use client'

import { Typography } from '@/shared/ui/typography'
import { useState } from 'react'

type FilterAccordionProps = {
  title?: string
  children: React.ReactNode
  defaultVisibleCount?: number
}

export function FilterAccordion({
  title,
  children,
  defaultVisibleCount = 10,
}: FilterAccordionProps) {
  const [expanded, setExpanded] = useState(false)

  // children ожидаются как массив элементов (li, чекбоксы и т.д.)
  const items = Array.isArray(children) ? children : [children]
  const visibleItems = expanded ? items : items.slice(0, defaultVisibleCount)

  return (
    <div className="border-b border-border pb-2">
      <Typography variant="inter-md-16" className="mb-5">
        {title || 'Категории'}
      </Typography>
      <ul className="space-y-2">{visibleItems}</ul>
      {items.length > defaultVisibleCount && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-muted-foreground hover:underline mt-1"
        >
          {expanded ? 'Скрыть' : `Показать ещё (${items.length - defaultVisibleCount})`}
        </button>
      )}
    </div>
  )
}
