'use server'

import type { User } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { UiWarehouse } from '../model/types'

export async function getWarehousesByTenant(user?: User | null): Promise<UiWarehouse[]> {
  // Get tenantId from user's first tenant
  const firstTenant = user?.tenants?.[0]
  if (!firstTenant) {
    return []
  }

  const tenantId =
    typeof firstTenant.tenant === 'object' ? firstTenant.tenant.id : firstTenant.tenant

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
    depth: 1, // Populate warehouse_address relationship
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
