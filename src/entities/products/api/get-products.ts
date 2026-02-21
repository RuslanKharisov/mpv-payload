import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'
import { Product, ProductCategory, Warehouse, Stock } from '@/payload-types' // Добавил Warehouse и Stock
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
  // Используем тип Where для корректной фильтрации
  const where: Where = {}
  let currentCategory: ProductCategory | undefined
  let selectedBrandSlugs: string[] = []
  let invalidCategory = false

  if (categorySlug) {
    currentCategory = allCategories.find((c) => c.slug === categorySlug)
    if (!currentCategory) {
      invalidCategory = true
    } else {
      const childrenIds = findAllCategoryChildrenIds(currentCategory.id, allCategories)
      // Преобразуем ID в строки/числа согласно типам вашей БД
      const allCategoryIds = [currentCategory.id, ...childrenIds]

      where['productCategory.id'] = { in: allCategoryIds }
    }
  }

  if (brandsSlug) {
    selectedBrandSlugs = brandsSlug.split(',')
    if (selectedBrandSlugs.length > 0) {
      where['brand.slug'] = { in: selectedBrandSlugs }
    }
  }

  if (phrase) {
    where.or = [{ name: { contains: phrase } }, { sku: { contains: phrase } }]
  }

  const hasStockFilters = condition || city || region

  if (hasStockFilters) {
    const stockWhere: Where = {}

    if (condition) {
      stockWhere.condition = { equals: condition }
    }

    if (city || region) {
      const warehouseWhere: Where = {}

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

      // Явно типизируем маппинг ID складов
      const warehouseIds = (warehouses.docs as Warehouse[]).map((w) => w.id)

      if (warehouseIds.length > 0) {
        stockWhere.warehouse = { in: warehouseIds }
      } else {
        stockWhere.warehouse = { in: [-1] }
      }
    }

    const stocks = await payload.find({
      collection: 'stocks',
      where: stockWhere,
      depth: 0,
      limit: 1000,
    })

    // Извлекаем ID продуктов из стоков.
    // В Payload связи хранятся как ID или объекты, делаем проверку типа.
    const stockProductIds = (stocks.docs as Stock[]).map((s) =>
      typeof s.product === 'object' ? s.product.id : s.product,
    )

    if (stockProductIds.length > 0) {
      where.id = { in: stockProductIds }
    } else {
      where.id = { in: [-1] }
    }
  }

  const productsReq = await payload.find({
    collection: 'products',
    where,
    page: pageNumber,
    limit: 12,
    depth: 1,
    // Выбираем только нужные поля для оптимизации
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
