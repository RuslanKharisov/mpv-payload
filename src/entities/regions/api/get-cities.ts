import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'

const getCities = cache(async (region?: string): Promise<string[]> => {
  const payload = await getPayload({ config: configPromise })

  // Формируем условие для фильтрации по региону, если он указан
  const where: any = {}
  if (region) {
    where['warehouse_address.region'] = { equals: region }
  }

  // Получаем склады с адресами
  const warehouses = await payload.find({
    collection: 'warehouses',
    depth: 1,
    limit: 1000,
    where,
  })

  // Извлекаем города из адресов складов
  const citiesSet = new Set<string>()

  for (const warehouse of warehouses.docs) {
    if (
      warehouse.warehouse_address &&
      typeof warehouse.warehouse_address === 'object' &&
      'city' in warehouse.warehouse_address
    ) {
      const city = (warehouse.warehouse_address as any).city
      if (city) {
        citiesSet.add(city)
      }
    }
  }

  // Сортируем города по алфавиту
  return Array.from(citiesSet).sort()
})

export default getCities
