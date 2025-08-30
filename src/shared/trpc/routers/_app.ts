import { productsRouter } from '@/entities/products/api/server/procedures'
import { createTRPCRouter } from '../init'
import { authRouter } from '@/entities/auth/api/server/procedures'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  products: productsRouter,
})

export type AppRouter = typeof appRouter
