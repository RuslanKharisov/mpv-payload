import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'
import { Address, Warehouse } from '@/payload-types'

async function getWarehouseAddressField<T extends string>(
  field: 'region' | 'city',
  filterRegion?: string,
): Promise<T[]> {
  const payload = await getPayload({ config: configPromise })

  const where: any = {}
  if (filterRegion && field === 'city') {
    where['warehouse_address.region'] = { equals: filterRegion }
  }

  //   ToDo оптимизировать запрос, если будет много складов (пагинация, индексы, и т.д.)
  const warehouses = await payload.find({
    collection: 'warehouses',
    depth: 1,
    pagination: false,
    where,
  })

  const valuesSet = new Set<string>()

  for (const warehouse of warehouses.docs as Warehouse[]) {
    if (
      warehouse.warehouse_address &&
      typeof warehouse.warehouse_address === 'object' &&
      field in warehouse.warehouse_address
    ) {
      const value = (warehouse.warehouse_address as Address)[field]
      if (value) valuesSet.add(value)
    }
  }

  return Array.from(valuesSet).sort() as T[]
}

// Then getCities becomes:
export const getCities = cache(async (region?: string) => getWarehouseAddressField('city', region))

// And getRegions becomes:
export const getRegions = cache(async () => getWarehouseAddressField('region'))
