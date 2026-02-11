import { baseProcedure, createTRPCRouter } from '@/shared/trpc/init'
import { Payload } from 'payload'
import z from 'zod'

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
   * Единый агрегатор статистики для всех фильтров (Города, Регионы, Состояния)
   */
  getFilterStats: baseProcedure.query(async ({ ctx }) => {
    const payload: Payload = ctx.payload

    // Получаем все активные остатки. Depth: 0 — это молниеносно.
    const stocks = await payload.find({
      collection: 'stocks',
      where: { quantity: { greater_than: 0 } },
      pagination: false,
      depth: 0,
      select: { condition: true, _city: true, _region: true },
    })

    const stats = {
      conditions: {} as Record<string, number>,
      cities: {} as Record<string, number>,
      regions: {} as Record<string, number>,
    }

    stocks.docs.forEach((stock) => {
      if (stock.condition) {
        stats.conditions[stock.condition] = (stats.conditions[stock.condition] || 0) + 1
      }
      if (stock._city) {
        stats.cities[stock._city] = (stats.cities[stock._city] || 0) + 1
      }
      if (stock._region) {
        stats.regions[stock._region] = (stats.regions[stock._region] || 0) + 1
      }
    })

    return stats
  }),
})
