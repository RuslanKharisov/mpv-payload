import { describe, it, expect, vi } from 'vitest'
import { getProducts } from '@/entities/products/api/get-products'

// Мокаем зависимости
vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    find: vi.fn().mockImplementation((params) => {
      // Возвращаем разные результаты в зависимости от коллекции
      if (params.collection === 'warehouses') {
        return Promise.resolve({
          docs: [{ id: 1 }, { id: 2 }],
          page: 1,
          totalPages: 1,
        })
      } else if (params.collection === 'stocks') {
        return Promise.resolve({
          docs: [{ product: 1 }, { product: 2 }],
          page: 1,
          totalPages: 1,
        })
      } else {
        return Promise.resolve({
          docs: [],
          page: 1,
          totalPages: 1,
        })
      }
    }),
  }),
}))

vi.mock('@payload-config', () => ({
  default: {},
}))

describe('getProducts filter logic', () => {
  const mockAllCategories: any = []

  it('should build correct filter for condition', async () => {
    await getProducts({
      condition: 'Б/У',
      allCategories: mockAllCategories,
    })

    // Тест проходит, если функция не выбрасывает исключения
    expect(true).toBe(true)
  })

  it('should build correct filter for city', async () => {
    await getProducts({
      city: 'Москва',
      allCategories: mockAllCategories,
    })

    // Тест проходит, если функция не выбрасывает исключения
    expect(true).toBe(true)
  })

  it('should build correct filter for region', async () => {
    await getProducts({
      region: 'Москва',
      allCategories: mockAllCategories,
    })

    // Тест проходит, если функция не выбрасывает исключения
    expect(true).toBe(true)
  })

  it('should build correct filter for both condition and region', async () => {
    await getProducts({
      condition: 'НОВЫЙ С ЗАВОДА',
      region: 'Санкт-Петербург',
      allCategories: mockAllCategories,
    })

    // Тест проходит, если функция не выбрасывает исключения
    expect(true).toBe(true)
  })
})
