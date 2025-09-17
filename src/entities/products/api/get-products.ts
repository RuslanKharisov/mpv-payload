import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Product } from '@/payload-types'
import { ProductCategory } from '@/payload-types'
import { ProductCategoryWithParents } from '@/entities/category/model/product-category-withParents'
import { findAllCategoryChildrenIds } from '@/entities/category/lib/find-all-category-childrenIds'

type Params = {
  page?: string
  categorySlug?: string
  phrase?: string
  allCategories: ProductCategoryWithParents[]
}

type ProductsResponse = {
  products: Product[]
  pagination: {
    page: number
    totalPages: number
  }
  currentCategory?: ProductCategory
  invalidCategory: boolean
}

export async function getProducts({
  page,
  categorySlug,
  phrase,
  allCategories,
}: Params): Promise<ProductsResponse> {
  const payload = await getPayload({ config: configPromise })

  const pageNumber = Number(page) || 1
  const where: any = {}
  let currentCategory: ProductCategory | undefined
  let invalidCategory = false

  if (categorySlug) {
    currentCategory = allCategories.find((c) => c.slug === categorySlug)
    if (!currentCategory) {
      invalidCategory = true
    } else {
      const childrenIds = findAllCategoryChildrenIds(currentCategory.id, allCategories)
      const allCategoryIds = [String(currentCategory.id), ...childrenIds]

      where['productCategory.id'] = { in: allCategoryIds }
    }
  }

  if (phrase) {
    where.or = [{ name: { contains: phrase } }, { sku: { contains: phrase } }]
  }

  const productsReq = await payload.find({
    collection: 'products',
    where,
    page: pageNumber,
    limit: 12,
    depth: 2,
  })

  return {
    products: productsReq.docs as Product[],
    pagination: {
      page: productsReq.page ?? 1,
      totalPages: productsReq.totalPages,
    },
    currentCategory,
    invalidCategory,
  }
}
