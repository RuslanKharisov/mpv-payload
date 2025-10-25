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

      // Выполняем отдельные запросы для каждого бренда
      for (const brandId of input.brandIds) {
        const countResult = await payload.count({
          collection: 'products',
          where: {
            'brand.id': { equals: brandId },
          },
        })
        counts[brandId] = countResult.totalDocs
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

      // Выполняем отдельные запросы для каждой категории
      for (const categoryId of input.categoryIds) {
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
        counts[categoryId] = countResult.totalDocs
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

      // Выполняем отдельные запросы для каждого условия
      for (const condition of input.conditions) {
        const countResult = await payload.count({
          collection: 'stocks',
          where: {
            and: [{ condition: { equals: condition } }, { quantity: { greater_than: 0 } }],
          },
        })
        counts[condition] = countResult.totalDocs
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

      // Выполняем отдельные запросы для каждого региона
      for (const region of input.regions) {
        const countResult = await payload.count({
          collection: 'stocks',
          where: {
            and: [
              { 'warehouse.warehouse_address.region': { equals: region } },
              { quantity: { greater_than: 0 } },
            ],
          },
        })
        counts[region] = countResult.totalDocs
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

      // Выполняем отдельные запросы для каждого города
      for (const city of input.cities) {
        const countResult = await payload.count({
          collection: 'stocks',
          where: {
            and: [
              { 'warehouse.warehouse_address.city': { equals: city } },
              { quantity: { greater_than: 0 } },
            ],
          },
        })
        counts[city] = countResult.totalDocs
      }

      return counts
    }),
})
