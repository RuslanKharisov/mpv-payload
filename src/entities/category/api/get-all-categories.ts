import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ProductCategoryWithParents } from '../model/product-category-withParents'

const getAllCategories = cache(async (): Promise<ProductCategoryWithParents[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'product-categories',
    depth: 1,
    limit: 1000,
  })

  return result.docs as ProductCategoryWithParents[]
})

export { getAllCategories }
