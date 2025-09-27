import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ProductCategoryWithParents } from '../model/product-category-withParents'
import { ProductCategory } from '@/payload-types'

const getCategoryBySlug = cache(async (categorySlug: string): Promise<ProductCategory[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'product-categories',
    depth: 1,
    limit: 1,
  })

  return result.docs as ProductCategory[]
})

export { getCategoryBySlug }
