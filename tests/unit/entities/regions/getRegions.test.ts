import { describe, it, expect, vi } from 'vitest'
import getRegions from '@/entities/regions/api/get-regions'

// Мокаем зависимости
vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    find: vi.fn().mockResolvedValue({
      docs: [
        {
          id: 1,
          warehouse_address: {
            region: 'Москва',
          },
        },
        {
          id: 2,
          warehouse_address: {
            region: 'Санкт-Петербург',
          },
        },
        {
          id: 3,
          warehouse_address: {
            region: 'Москва', // Дубликат
          },
        },
      ],
    }),
  }),
}))

vi.mock('@payload-config', () => ({
  default: {},
}))

describe('getRegions', () => {
  it('should return unique sorted regions', async () => {
    const regions = await getRegions()

    expect(regions).toBeDefined()
    expect(Array.isArray(regions)).toBe(true)
    expect(regions).toEqual(['Москва', 'Санкт-Петербург'])
  })
})
