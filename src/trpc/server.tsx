import 'server-only' // <-- убедитесь, что этот файл не может быть импортирован с клиента
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { cache } from 'react'
import { createTRPCContext } from './init'
import { makeQueryClient } from './query-client'
import { appRouter } from './routers/_app'

// Важно: Создайте стабильный геттер для клиента запросов, который
//        будет возвращать одного и того же клиента в течение одного запроса.
export const getQueryClient = cache(makeQueryClient)
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
})
