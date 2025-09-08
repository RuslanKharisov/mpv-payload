import { productsRouter } from '@/entities/products/api/server/procedures'
import { createTRPCRouter } from '../init'
import { authRouter } from '@/entities/auth/api/server/procedures'
import { remoteStocksRouter } from '@/entities/remote-stock/api/server/procedure'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  products: productsRouter,
  remoteStocks: remoteStocksRouter,
})

export type AppRouter = typeof appRouter
