import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { RegionFilter } from '@/widgets/filters-sidebar/_ui/region-filter'
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

describe('RegionFilter', () => {
  it('should render region filter options', () => {
    const { getByText } = render(
      <FiltersProvider initialFilters={{}}>
        <RegionFilter regions={['Москва', 'Санкт-Петербург', 'Московская область']} />
      </FiltersProvider>,
    )

    expect(getByText('Регион')).toBeTruthy()
    expect(getByText('Москва')).toBeTruthy()
    expect(getByText('Санкт-Петербург')).toBeTruthy()
    expect(getByText('Московская область')).toBeTruthy()
  })

  it('should display filter without errors when region is provided', () => {
    const { container } = render(
      <FiltersProvider initialFilters={{ region: 'Москва' }}>
        <RegionFilter regions={['Москва', 'Санкт-Петербург']} />
      </FiltersProvider>,
    )

    // Проверяем, что компонент отрендерился без ошибок
    expect(container).toBeTruthy()
  })
})
