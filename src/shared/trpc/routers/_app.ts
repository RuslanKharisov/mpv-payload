import { productsRouter } from '@/entities/products/api/server/procedures'
import { createTRPCRouter } from '../init'
import { authRouter } from '@/entities/auth/api/server/procedures'
import { remoteStocksRouter } from '@/entities/remote-stock/api/server/procedure'
import { sendPriceRequestRouter } from '@/features/send-price-request/api/server/procedure'
import { tenantsRouter } from '@/entities/tenant/api/server/procedures'
import { dashboardRouter } from '@/entities/dashboard/api/server/procedures'
import { billingRequestRouter } from '@/features/billing-request/api/server/procedure'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  products: productsRouter,
  remoteStocks: remoteStocksRouter,
  sendPriceRequest: sendPriceRequestRouter,
  tenants: tenantsRouter,
  dashboard: dashboardRouter,
  billingRequest: billingRequestRouter,
})

export type AppRouter = typeof appRouter
