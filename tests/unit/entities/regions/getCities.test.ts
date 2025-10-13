import { getCities } from '@/entities/warehouse'
import { describe, it, expect, vi } from 'vitest'

// Мокаем зависимости
vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    find: vi.fn().mockImplementation((params) => {
      if (params.where && params.where['warehouse_address.region']) {
        // Фильтр по региону
        const region = params.where['warehouse_address.region'].equals
        if (region === 'Москва') {
          return Promise.resolve({
            docs: [
              {
                id: 1,
                warehouse_address: {
                  city: 'Москва',
                },
              },
              {
                id: 2,
                warehouse_address: {
                  city: 'Подольск',
                },
              },
            ],
          })
        }
      }

      // Без фильтра
      return Promise.resolve({
        docs: [
          {
            id: 1,
            warehouse_address: {
              city: 'Москва',
            },
          },
          {
            id: 2,
            warehouse_address: {
              city: 'Санкт-Петербург',
            },
          },
          {
            id: 3,
            warehouse_address: {
              city: 'Новосибирск',
            },
          },
        ],
      })
    }),
  }),
}))

vi.mock('@payload-config', () => ({
  default: {},
}))

describe('getCities', () => {
  it('should return all cities when no region specified', async () => {
    const cities = await getCities()

    expect(cities).toBeDefined()
    expect(Array.isArray(cities)).toBe(true)
    expect(cities).toEqual(['Москва', 'Новосибирск', 'Санкт-Петербург'])
  })

  it('should return cities filtered by region', async () => {
    const cities = await getCities('Москва')

    expect(cities).toBeDefined()
    expect(Array.isArray(cities)).toBe(true)
    expect(cities).toEqual(['Москва', 'Подольск'])
  })
})
