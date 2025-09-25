import { productsRouter } from '@/entities/products/api/server/procedures'
import { createTRPCRouter } from '../init'
import { authRouter } from '@/entities/auth/api/server/procedures'
import { remoteStocksRouter } from '@/entities/remote-stock/api/server/procedure'
import { sendPriceRequestRouter } from '@/features/send-price-request/api/server/procedure'
import { tenantsRouter } from '@/entities/tenant/api/server/procedures'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  products: productsRouter,
  remoteStocks: remoteStocksRouter,
  sendPriceRequest: sendPriceRequestRouter,
  tenants: tenantsRouter,
})

export type AppRouter = typeof appRouter
