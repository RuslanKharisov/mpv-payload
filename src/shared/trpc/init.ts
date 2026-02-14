import config from '@payload-config'
import { initTRPC, TRPCError } from '@trpc/server'
import { getPayload } from 'payload'
import { cache } from 'react'
import superjson from 'superjson'
import { getMeUser } from '../utilities/getMeUser'

// 1) Функция контекста для одного запроса (RSC / server actions)
export const createTRPCContext = cache(async () => {
  const payload = await getPayload({ config })

  // getMeUser уже умеет доставать текущего пользователя из куки/сессии
  // Returns null user during static generation when cookies() is not available
  const { user } = await getMeUser()

  return {
    payload,
    user,
  }
})

// 2) Инициализация tRPC с типизированным контекстом
const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create({
  transformer: superjson,
})

export const createTRPCRouter = t.router

// 3) Базовая процедура: гарантирует наличие payload + user в ctx
export const baseProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: { ...ctx, user: ctx.user },
  })
})

// 4) Базовая процедура без проверки для публичных роутов
export const baseProcedurePublic = t.procedure.use(async ({ ctx, next }) => {
  return next({
    ctx: { ...ctx, user: ctx.user },
  })
})

// 5) Внешняя процедура без доп. контекста (для совсем публичных вещей)
export const ApiExternalProcedure = t.procedure.use(async ({ next }) => {
  return next()
})
