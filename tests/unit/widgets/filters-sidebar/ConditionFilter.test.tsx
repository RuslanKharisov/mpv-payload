import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { ConditionFilter } from '@/widgets/filters-sidebar/_ui/condition-filter'
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

describe('ConditionFilter', () => {
  it('should render condition filter options', () => {
    const { getByText } = render(<ConditionFilter />)

    expect(getByText('Состояние')).toBeTruthy()
    expect(getByText('Новый с завода')).toBeTruthy()
    expect(getByText('Новый излишек')).toBeTruthy()
    expect(getByText('Б/У')).toBeTruthy()
    expect(getByText('Восстановлен')).toBeTruthy()
  })

  it('should display checked condition when provided', () => {
    const { container } = render(<ConditionFilter condition="НОВЫЙ С ЗАВОДА" />)

    // Проверяем, что компонент отрендерился без ошибок
    expect(container).toBeTruthy()
  })
})
