import { initTRPC } from '@trpc/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from 'react'
import superjson from 'superjson'

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' }
})

// Избегайте экспорта всего объекта t,
// поскольку он не очень иформативен.
// Например, использование переменной t
// распространено в библиотеках i18n.

const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
})
// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory

export const baseProcedure = t.procedure.use(async ({ next }) => {
  const payload = await getPayload({ config })

  return next({
    ctx: { payload },
  })
})
