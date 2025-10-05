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
  brandsSlug?: string
}

type ProductsResponse = {
  products: Product[]
  pagination: {
    page: number
    totalPages: number
  }
  currentCategory?: ProductCategory
  invalidCategory: boolean
  selectedBrandSlugs: string[]
}

export async function getProducts({
  page,
  categorySlug,
  phrase,
  allCategories,
  brandsSlug,
}: Params): Promise<ProductsResponse> {
  const payload = await getPayload({ config: configPromise })

  const pageNumber = Number(page) || 1
  const where: any = {}
  let currentCategory: ProductCategory | undefined
  let selectedBrandSlugs: string[] = []
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

  if (brandsSlug) {
    // Превращаем строку в массив и сохраняем в нашу переменную
    selectedBrandSlugs = brandsSlug.split(',')

    if (selectedBrandSlugs.length > 0) {
      where['brand.slug'] = { in: selectedBrandSlugs }
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
    depth: 1,
    select: {
      sku: true,
      name: true,
      slug: true,
      productImage: true,
    },
  })

  return {
    products: productsReq.docs as Product[],
    pagination: {
      page: productsReq.page ?? 1,
      totalPages: productsReq.totalPages,
    },
    currentCategory,
    invalidCategory,
    selectedBrandSlugs: selectedBrandSlugs,
  }
}
