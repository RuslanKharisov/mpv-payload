import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Brand } from '@/payload-types'

async function getBrandBySlug(brandsSlug: string): Promise<Brand[]> {
  const payload = await getPayload({ config: configPromise })

  const brands = await payload.find({
    collection: 'brands',
    depth: 1,
    limit: 1,
  })

  return brands.docs
}

export { getBrandBySlug }
