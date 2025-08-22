import { createTRPCRouter } from '../init'
import { authRouter } from '@/shared/modules/auth/server/procedures'

export const appRouter = createTRPCRouter({
  auth: authRouter,
})

export type AppRouter = typeof appRouter
