'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { UiWarehouse } from '../model/types'

export async function getWarehousesByTenant(
  tenantId?: string | number | null,
): Promise<UiWarehouse[]> {
  if (!tenantId) {
    return []
  }

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'warehouses',
    where: {
      tenant: {
        equals: tenantId,
      },
    },
    depth: 1,
  })

  // Map to simplified Warehouse type with address string
  return result.docs.map((doc) => {
    const address =
      typeof doc.warehouse_address === 'object' && doc.warehouse_address !== null
        ? (doc.warehouse_address.fullAddress ?? '')
        : ''

    return {
      id: String(doc.id),
      title: doc.title,
      address,
      capacity: doc.capacity ?? null,
      // Note: isDefault field doesn't exist in current schema, defaulting to false
      isDefault: false,
    }
  })
}
