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
  condition?: string
  city?: string
  region?: string
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
  condition,
  city,
  region,
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

  // Сначала получим ID продуктов, которые соответствуют фильтрам по stocks
  let stockProductIds: number[] = []
  const hasStockFilters = condition || city || region

  if (hasStockFilters) {
    // Формируем запрос к коллекции stocks с нужными фильтрами
    const stockWhere: any = {}

    // Фильтр по состоянию товара
    if (condition) {
      stockWhere.condition = { equals: condition }
    }

    // Фильтр по городу и региону
    if (city || region) {
      // Получаем склады с учетом фильтров по городу и региону
      const warehouseWhere: any = {}

      if (region) {
        warehouseWhere['warehouse_address.region'] = { equals: region }
      }

      if (city) {
        warehouseWhere['warehouse_address.city'] = { equals: city }
      }

      const warehouses = await payload.find({
        collection: 'warehouses',
        where: warehouseWhere,
        depth: 0,
        limit: 1000,
      })

      const warehouseIds = warehouses.docs.map((w: any) => w.id)

      if (warehouseIds.length > 0) {
        stockWhere.warehouse = { in: warehouseIds }
      } else {
        // Если нет складов, удовлетворяющих условиям, то нет и товаров
        stockWhere.warehouse = { in: [-1] } // Несуществующий ID
      }
    }

    // Получаем stocks с нужными фильтрами
    const stocks = await payload.find({
      collection: 'stocks',
      where: stockWhere,
      depth: 0,
      limit: 1000,
    })

    stockProductIds = stocks.docs.map((s: any) => s.product)

    // Если есть фильтры по stocks, добавляем фильтр по ID продуктов
    if (stockProductIds.length > 0) {
      where.id = { in: stockProductIds }
    } else {
      // Если нет подходящих stocks, возвращаем пустой результат
      where.id = { in: [-1] } // Несуществующий ID
    }
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
