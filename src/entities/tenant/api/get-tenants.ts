'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getTenants() {
  const payload = await getPayload({ config: configPromise })

  try {
    const suppliersList = await payload.find({
      collection: 'tenants',
      depth: 2,
      limit: 12,
      pagination: false,
    })

    return suppliersList.docs
  } catch (error) {
    throw new Error(
      `Error getting tenants: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
