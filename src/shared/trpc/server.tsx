import 'server-only'

import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { cache } from 'react'
import { createTRPCContext } from './init'
import { makeQueryClient } from './query-client'
import { appRouter } from './routers/_app'

// Стабильный QueryClient на время одного запроса
export const getQueryClient = cache(makeQueryClient)

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext, // функция, которая вернёт { payload, user }
  router: appRouter,
  queryClient: getQueryClient,
})

// Caller для server components / server actions
export const caller = appRouter.createCaller(await createTRPCContext())
