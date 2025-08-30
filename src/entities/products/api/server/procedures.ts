import { normalizeStockRow } from '@/features/stock'
import { Stock } from '@/payload-types'
import { baseProcedure, createTRPCRouter } from '@/shared/trpc/init'
import { Payload } from 'payload'
import z from 'zod'

export const productsRouter = createTRPCRouter({
  stocksBySlug: baseProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const payload: Payload = ctx.payload

      // 1) находим продукт по slug
      const prodRes = await payload.find({
        collection: 'products',
        where: { slug: { equals: input.slug } },
        limit: 1,
      })

      const product = prodRes.docs[0]
      if (!product) return []

      // 2) тянем склады по продукту
      // добавь сюда фильтр по тенанту, если нужно:
      // where: { product: { equals: product.id }, quantity: { greater_than: 0 }, tenant: { equals: ctx.tenantId } }
      const stockRes = await payload.find({
        collection: 'stocks',
        where: {
          and: [{ product: { equals: product.id } }, { quantity: { greater_than: 0 } }],
        },
        depth: 2,
        limit: 10,
      })
      console.log('stockRes ==> ', stockRes)

      // 3) нормализуем ответ под виджет
      return stockRes.docs.map((row) => normalizeStockRow(row))
    }),
})
