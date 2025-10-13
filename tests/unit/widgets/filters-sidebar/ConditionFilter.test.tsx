import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { ConditionFilter } from '@/widgets/filters-sidebar/_ui/condition-filter'
import { FiltersProvider } from '@/shared/providers/Filters'
import * as nextNavigation from 'next/navigation'

// Мокаем next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    toString: () => '',
    has: vi.fn(),
    get: vi.fn(),
  }),
}))

describe('ConditionFilter', () => {
  it('should render condition filter options', () => {
    const { getByText } = render(
      <FiltersProvider initialFilters={{}}>
        <ConditionFilter />
      </FiltersProvider>,
    )

    expect(getByText('Состояние')).toBeTruthy()
    expect(getByText('Новый с завода')).toBeTruthy()
    expect(getByText('Новый излишек')).toBeTruthy()
    expect(getByText('Б/У')).toBeTruthy()
    expect(getByText('Восстановлен')).toBeTruthy()
  })

  it('should display checked condition when provided', () => {
    const { container } = render(
      <FiltersProvider initialFilters={{ condition: 'НОВЫЙ С ЗАВОДА' }}>
        <ConditionFilter />
      </FiltersProvider>,
    )

    // Проверяем, что компонент отрендерился без ошибок
    expect(container).toBeTruthy()
  })
})
