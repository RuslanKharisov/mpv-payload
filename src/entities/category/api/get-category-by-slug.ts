import { ProductCategory } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

const getCategoryBySlug = cache(async (categorySlug: string): Promise<ProductCategory | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'product-categories',
    depth: 1,
    limit: 1,
    where: {
      slug: {
        equals: categorySlug,
      },
    },
  })

  return (result.docs[0] as ProductCategory) || null
})

export { getCategoryBySlug }
