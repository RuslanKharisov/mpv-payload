import { baseProcedure, createTRPCRouter } from '@/shared/trpc/init'
import { Payload } from 'payload'
import z from 'zod'
import { findAllCategoryChildrenIds } from '@/entities/category/lib/find-all-category-childrenIds'
import { buildCategoryTreeMap } from '@/entities/category/lib/build-category-tree-map'
import { getAllDescendantIds } from '@/entities/category/lib/get-all-descendant-ids'

export const productsRouter = createTRPCRouter({
  stocksBySlug: baseProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const payload: Payload = ctx.payload

      const prodRes = await payload.find({
        collection: 'products',
        where: { slug: { equals: input.slug } },
        limit: 1,
      })

      const product = prodRes.docs[0]
      if (!product)
        return {
          docs: [],
        }

      const stockRes = await payload.find({
        collection: 'stocks',
        where: {
          and: [{ product: { equals: product.id } }, { quantity: { greater_than: 0 } }],
        },
        depth: 2,
        limit: 2,
      })

      return stockRes
    }),

  /**
   * Получает количество товаров по id брендов
   */
  countByBrandIds: baseProcedure
    .input(z.object({ brandIds: z.array(z.number().min(1)) }))
    .query(async ({ ctx, input }) => {
      const payload: Payload = ctx.payload

      const countsEntries = await Promise.all(
        input.brandIds.map(async (brandId) => {
          const products = await payload.find({
            collection: 'products',
            where: {
              'brand.id': { equals: brandId },
            },
            select: {},
            pagination: false,
          })

          const productIds = products.docs.map((p) => p.id)

          if (productIds.length === 0) {
            return [brandId, 0] as const
          }

          const countResult = await payload.count({
            collection: 'stocks',
            where: {
              and: [{ product: { in: productIds } }, { quantity: { greater_than: 0 } }],
            },
          })

          return [brandId, countResult.totalDocs] as const
        }),
      )

      return Object.fromEntries(countsEntries)
    }),

  /**
   * Bulk endpoint для категорий
   */
  countByCategoryAndChildrenIdsBulk: baseProcedure
    .input(z.object({ categoryIds: z.array(z.number().min(1)) }))
    .query(async ({ ctx, input }) => {
      const payload: Payload = ctx.payload

      // Загружаем категории с минимальными полями
      const categoriesRes = await payload.find({
        collection: 'product-categories',
        pagination: false,
        select: { id: true, parent: true },
        depth: 0,
      })

      const tree = buildCategoryTreeMap(categoriesRes.docs)

      const countsEntries = await Promise.all(
        input.categoryIds.map(async (categoryId) => {
          const descendantIds = getAllDescendantIds(categoryId, tree)
          const allCategoryIds = [categoryId, ...descendantIds]

          // Найти продукты в этих категориях
          const products = await payload.find({
            collection: 'products',
            where: {
              'productCategory.id': { in: allCategoryIds },
            },
            select: {},
            pagination: false,
          })

          const productIds = products.docs.map((p) => p.id)

          if (productIds.length === 0) {
            return [categoryId, 0] as const
          }

          const countResult = await payload.count({
            collection: 'stocks',
            where: {
              and: [{ product: { in: productIds } }, { quantity: { greater_than: 0 } }],
            },
          })

          return [categoryId, countResult.totalDocs] as const
        }),
      )

      return Object.fromEntries(countsEntries)
    }),

  /**
   * Получает количество товаров по множеству условий
   */
  countByConditions: baseProcedure
    .input(z.object({ conditions: z.array(z.string().min(1)) }))
    .query(async ({ ctx, input }) => {
      const payload: Payload = ctx.payload

      // Создаем карту для результатов
      const counts: Record<string, number> = {}

      // Выполняем параллельные запросы для каждого условия
      const promises = input.conditions.map(async (condition) => {
        const countResult = await payload.count({
          collection: 'stocks',
          where: {
            and: [{ condition: { equals: condition } }, { quantity: { greater_than: 0 } }],
          },
        })
        return { condition, count: countResult.totalDocs }
      })

      // Выполняем все запросы параллельно
      const results = await Promise.all(promises)

      // Заполняем карту результатами
      for (const { condition, count } of results) {
        counts[condition] = count
      }

      return counts
    }),

  /**
   * Подсчет количества товаров по регионам
   */
  countByRegions: baseProcedure
    .input(z.object({ regions: z.array(z.string().min(1)) }))
    .query(async ({ ctx, input }) => {
      const payload: Payload = ctx.payload

      // Создаем карту для результатов
      const counts: Record<string, number> = {}

      // Выполняем параллельные запросы для каждого региона
      const promises = input.regions.map(async (region) => {
        // Сначала получаем склады по региону
        const warehouses = await payload.find({
          collection: 'warehouses',
          where: { 'warehouse_address.region': { equals: region } },
          pagination: false,
        })
        const warehouseIds = warehouses.docs.map((w: any) => w.id)

        // Затем считаем stocks по этим складам
        const countResult = await payload.count({
          collection: 'stocks',
          where: {
            and: [{ warehouse: { in: warehouseIds } }, { quantity: { greater_than: 0 } }],
          },
        })

        return { region, count: countResult.totalDocs }
      })

      // Выполняем все запросы параллельно
      const results = await Promise.all(promises)

      // Заполняем карту результатами
      for (const { region, count } of results) {
        counts[region] = count
      }

      return counts
    }),

  /**
   * Получаем количество товаров по городам
   **/
  countByCities: baseProcedure
    .input(z.object({ cities: z.array(z.string().min(1)) }))
    .query(async ({ ctx, input }) => {
      const payload: Payload = ctx.payload

      const counts: Record<string, number> = {}

      const promises = input.cities.map(async (city) => {
        // Сначала получаем склады по городу
        const warehouses = await payload.find({
          collection: 'warehouses',
          where: { 'warehouse_address.city': { equals: city } },
          pagination: false,
        })
        const warehouseIds = warehouses.docs.map((w: any) => w.id)

        // Затем считаем stocks по этим складам
        const countResult = await payload.count({
          collection: 'stocks',
          where: {
            and: [{ warehouse: { in: warehouseIds } }, { quantity: { greater_than: 0 } }],
          },
        })

        return { city, count: countResult.totalDocs }
      })

      // Выполняем все запросы параллельно
      const results = await Promise.all(promises)

      // Заполняем карту результатами
      for (const { city, count } of results) {
        counts[city] = count
      }

      return counts
    }),
})
