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

  countByBrandId: baseProcedure
    .input(z.object({ brandId: z.number().min(1) }))
    .query(async ({ ctx, input }) => {
      const payload: Payload = ctx.payload

      // Используем count вместо find для более эффективного подсчета
      const countResult = await payload.count({
        collection: 'stocks',
        where: {
          and: [
            { 'product.brand.id': { equals: input.brandId } },
            { quantity: { greater_than: 0 } },
          ],
        },
      })

      return { totalDocs: countResult.totalDocs, docs: [] }
    }),

  countByCategoryAndChildrenIds: baseProcedure
    .input(z.object({ categoryId: z.number().min(1) }))
    .query(async ({ ctx, input }) => {
      const payload: Payload = ctx.payload

      // First get all categories to find children
      const categoriesRes = await payload.find({
        collection: 'product-categories',
        limit: 0,
        // Оптимизируем запрос, выбирая только необходимые поля
        select: {
          id: true,
          parent: true,
        },
      })

      // Find all child category IDs
      const childCategoryIds = findAllCategoryChildrenIds(
        input.categoryId,
        categoriesRes.docs as any,
      )

      // Include parent category ID in the list
      const allCategoryIds = [String(input.categoryId), ...childCategoryIds]

      // Используем count вместо find для более эффективного подсчета
      const countResult = await payload.count({
        collection: 'stocks',
        where: {
          and: [
            { 'product.productCategory.id': { in: allCategoryIds } },
            { quantity: { greater_than: 0 } },
          ],
        },
      })

      return { totalDocs: countResult.totalDocs, docs: [] }
    }),

  countByCondition: baseProcedure
    .input(z.object({ condition: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const payload: Payload = ctx.payload

      // Используем count вместо find для более эффективного подсчета
      const countResult = await payload.count({
        collection: 'stocks',
        where: {
          and: [{ condition: { equals: input.condition } }, { quantity: { greater_than: 0 } }],
        },
      })

      return { totalDocs: countResult.totalDocs, docs: [] }
    }),

  countByRegion: baseProcedure
    .input(z.object({ region: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const payload: Payload = ctx.payload

      // Используем count вместо find для более эффективного подсчета
      const countResult = await payload.count({
        collection: 'stocks',
        where: {
          and: [
            { 'warehouse.warehouse_address.region': { equals: input.region } },
            { quantity: { greater_than: 0 } },
          ],
        },
      })

      return { totalDocs: countResult.totalDocs, docs: [] }
    }),

  countByCity: baseProcedure
    .input(z.object({ city: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const payload: Payload = ctx.payload

      // Используем count вместо find для более эффективного подсчета
      const countResult = await payload.count({
        collection: 'stocks',
        where: {
          and: [
            { 'warehouse.warehouse_address.city': { equals: input.city } },
            { quantity: { greater_than: 0 } },
          ],
        },
      })

      return { totalDocs: countResult.totalDocs, docs: [] }
    }),
})
