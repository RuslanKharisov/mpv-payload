import { initTRPC } from '@trpc/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from 'react'
import superjson from 'superjson'
import { getMeUser } from '../utilities/getMeUser'
import { User } from '@/payload-types'

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
  return next({
    ctx,
  })
})

// 4) Внешняя процедура без доп. контекста (для совсем публичных вещей)
export const ApiExternalProcedure = t.procedure.use(async ({ next }) => {
  return next()
})
