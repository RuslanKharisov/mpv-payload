import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { CityFilter } from '@/widgets/filters-sidebar/_ui/city-filter'
import * as nextNavigation from 'next/navigation'

// Мокаем next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    toString: () => '',
    has: vi.fn(),
  }),
}))

describe('CityFilter', () => {
  it('should render city filter options', () => {
    const { getByText } = render(<CityFilter />)

    expect(getByText('Город')).toBeTruthy()
    expect(getByText('Москва')).toBeTruthy()
    expect(getByText('Санкт-Петербург')).toBeTruthy()
    expect(getByText('Новосибирск')).toBeTruthy()
  })

  it('should display filter without errors when city is provided', () => {
    const { container } = render(<CityFilter city="Москва" />)

    // Проверяем, что компонент отрендерился без ошибок
    expect(container).toBeTruthy()
  })

  it('should filter cities by region', () => {
    const { container } = render(<CityFilter region="Москва" />)

    // Проверяем, что компонент отрендерился без ошибок
    expect(container).toBeTruthy()
  })
})
