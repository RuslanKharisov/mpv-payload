'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Tenant } from '@/payload-types'

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'tenants',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
      depth: 1,
    })

    return result.docs[0] || null
  } catch (error) {
    console.error('Error fetching tenant by slug:', error)
    return null
  }
}
