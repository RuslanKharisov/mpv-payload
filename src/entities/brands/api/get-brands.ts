import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Brand } from '@/payload-types'
import { cache } from 'react'

const getBrands = cache(async (): Promise<Brand[]> => {
  const payload = await getPayload({ config: configPromise })

  const brands = await payload.find({
    collection: 'brands',
    depth: 0,
    limit: 200,
    sort: 'name',
    select: {
      name: true,
      slug: true,
    },
  })

  return brands.docs as Brand[]
})

export default getBrands
