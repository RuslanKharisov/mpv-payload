import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'

const getRegions = cache(async (): Promise<string[]> => {
  const payload = await getPayload({ config: configPromise })

  // Получаем уникальные регионы из адресов, которые используются в складах
  const warehouses = await payload.find({
    collection: 'warehouses',
    depth: 1,
    limit: 1000,
  })

  // Извлекаем регионы из адресов складов
  const regionsSet = new Set<string>()

  for (const warehouse of warehouses.docs) {
    if (
      warehouse.warehouse_address &&
      typeof warehouse.warehouse_address === 'object' &&
      'region' in warehouse.warehouse_address
    ) {
      const region = (warehouse.warehouse_address as any).region
      if (region) {
        regionsSet.add(region)
      }
    }
  }

  // Сортируем регионы по алфавиту
  return Array.from(regionsSet).sort()
})

export default getRegions
