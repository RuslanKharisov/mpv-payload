'use client'

import { useState, useMemo } from 'react'
import { SlidersHorizontal, XIcon } from 'lucide-react'
import { cn } from '@/shared/utilities/ui'
import { useFilters } from '@/shared/providers/Filters'
import { FilterAccordion } from '@/widgets/filters-sidebar/_ui/filter-accordion'

type CompanyFiltersSidebarProps = {
  pageTitle: string
  countries: string[]
  tags: { id: number; name?: string | null; slug?: string | null }[]
}

export function CompanyFiltersSidebar({ pageTitle, countries, tags }: CompanyFiltersSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { filters, setFilter, resetFilters } = useFilters()

  const activeTagSlugs = (filters.tags as string[] | undefined) ?? []

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => a.localeCompare(b, 'ru')),
    [countries],
  )

  const sortedTags = useMemo(
    () => [...tags].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'ru')),
    [tags],
  )

  return (
    <>
      <button
        className="z-50 w-full p-2 md:hidden flex justify-end"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Меню"
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <SlidersHorizontal className="h-6 w-6" />}
      </button>

      <div
        className={cn(
          'z-40 bg-background -translate-x-[200%] absolute left-0 h-full w-full min-w-fit md:max-w-81 space-y-4 md:relative md:translate-x-0 md:min-w-67.5 duration-300',
          isOpen ? 'translate-x-0 w-full' : '-translate-x-full',
        )}
      >
        <div className="p-4 max-w-full bg-card space-y-6 h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] sticky top-4 overflow-y-auto">
          <button
            className="text-xs text-muted-foreground underline cursor-pointer"
            onClick={() => resetFilters()}
          >
            Сбросить фильтры
          </button>

          <h2 className="font-semibold text-base">{pageTitle}</h2>

          {/* Страны */}
          <FilterAccordion title="Страна" defaultVisibleCount={10}>
            {sortedCountries.map((country) => (
              <button
                key={country}
                type="button"
                className={cn(
                  'w-full text-left text-sm px-2 py-1 rounded',
                  filters.country === country
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted',
                )}
                onClick={() =>
                  setFilter('country', filters.country === country ? undefined : country)
                }
              >
                {country}
              </button>
            ))}
          </FilterAccordion>

          {/* Теги */}
          <FilterAccordion title="Категории" defaultVisibleCount={8}>
            {sortedTags.map((tag) => {
              const slug = tag.slug ?? ''
              const isActive = activeTagSlugs.includes(slug)
              const next = isActive
                ? activeTagSlugs.filter((s) => s !== slug)
                : [...activeTagSlugs, slug]

              return (
                <button
                  key={tag.id}
                  type="button"
                  className={cn(
                    'w-full text-left text-sm px-2 py-1 rounded',
                    isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                  )}
                  onClick={() => setFilter('tags' as any, next.length ? next : undefined)}
                >
                  {tag.name}
                </button>
              )
            })}
          </FilterAccordion>

          {/* Наличие склада */}
          <FilterAccordion title="Наличие склада" defaultVisibleCount={3}>
            <div className="flex flex-col gap-1 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="hasStock"
                  checked={!filters.hasStock}
                  onChange={() => setFilter('hasStock' as any, undefined)}
                />
                Все компании
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="hasStock"
                  checked={filters.hasStock === '1'}
                  onChange={() => setFilter('hasStock' as any, '1')}
                />
                Только со складом
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="hasStock"
                  checked={filters.hasStock === '0'}
                  onChange={() => setFilter('hasStock' as any, '0')}
                />
                Без склада
              </label>
            </div>
          </FilterAccordion>
        </div>
      </div>
    </>
  )
}
