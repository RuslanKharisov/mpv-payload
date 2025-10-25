import { baseProcedure, createTRPCRouter } from '@/shared/trpc/init'
import { Payload } from 'payload'
import z from 'zod'
import { findAllCategoryChildrenIds } from '@/entities/category/lib/find-all-category-childrenIds'

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

  // Bulk endpoint для брендов
  countByBrandIds: baseProcedure
    .input(z.object({ brandIds: z.array(z.number().min(1)) }))
    .query(async ({ ctx, input }) => {
      const payload: Payload = ctx.payload

      // Создаем карту для результатов
      const counts: Record<number, number> = {}

      // Выполняем параллельные запросы для каждого бренда
      const promises = input.brandIds.map(async (brandId) => {
        const countResult = await payload.count({
          collection: 'products',
          where: {
            'brand.id': { equals: brandId },
          },
        })
        return { brandId, count: countResult.totalDocs }
      })

      // Выполняем все запросы параллельно
      const results = await Promise.all(promises)

      // Заполняем карту результатами
      for (const { brandId, count } of results) {
        counts[brandId] = count
      }

      return counts
    }),

  // Bulk endpoint для категорий
  countByCategoryAndChildrenIdsBulk: baseProcedure
    .input(z.object({ categoryIds: z.array(z.number().min(1)) }))
    .query(async ({ ctx, input }) => {
      const payload: Payload = ctx.payload

      // Создаем карту для результатов
      const counts: Record<number, number> = {}

      // First get all categories to find children
      const categoriesRes = await payload.find({
        collection: 'product-categories',
        pagination: false, // Используем pagination: false вместо limit: 0
        select: {
          id: true,
          parent: true,
        },
      })

      // Выполняем параллельные запросы для каждой категории
      const promises = input.categoryIds.map(async (categoryId) => {
        // Find all child category IDs
        const childCategoryIds = findAllCategoryChildrenIds(categoryId, categoriesRes.docs as any)

        // Include parent category ID in the list (без строкового преобразования)
        const allCategoryIds = [categoryId, ...childCategoryIds]

        const countResult = await payload.count({
          collection: 'products',
          where: {
            'productCategory.id': { in: allCategoryIds },
          },
        })

        return { categoryId, count: countResult.totalDocs }
      })

      // Выполняем все запросы параллельно
      const results = await Promise.all(promises)

      // Заполняем карту результатами
      for (const { categoryId, count } of results) {
        counts[categoryId] = count
      }

      return counts
    }),

  // Bulk endpoint для условий
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

  // Bulk endpoint для регионов
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

  // Bulk endpoint для городов
  countByCities: baseProcedure
    .input(z.object({ cities: z.array(z.string().min(1)) }))
    .query(async ({ ctx, input }) => {
      const payload: Payload = ctx.payload

      // Создаем карту для результатов
      const counts: Record<string, number> = {}

      // Выполняем параллельные запросы для каждого города
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
