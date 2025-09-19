import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Brand } from '@/payload-types'

async function getBrands(): Promise<Brand[]> {
  const payload = await getPayload({ config: configPromise })

  const brands = await payload.find({
    collection: 'brands',
    depth: 1,
    limit: 200,
  })

  return brands.docs
}

export default getBrands
