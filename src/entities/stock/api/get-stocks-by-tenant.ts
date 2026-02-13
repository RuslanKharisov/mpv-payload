import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Stock } from '@/payload-types'

export const getStocksByTenant = cache(async (tenantId: string): Promise<Stock[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'stocks',
    depth: 1,
    limit: 200,
    where: {
      tenant: {
        equals: tenantId,
      },
    },
    sort: '-updatedAt',
  })

  return result.docs as Stock[]
})
