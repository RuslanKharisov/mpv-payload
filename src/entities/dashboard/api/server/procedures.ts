import { baseProcedure, createTRPCRouter } from '@/shared/trpc/init'
import { getSupplierDashboardSummaryServer } from './get-supplier-dashboard-summary'

export const dashboardRouter = createTRPCRouter({
  getSupplierSummary: baseProcedure.query(async ({ ctx }) => {
    return getSupplierDashboardSummaryServer({
      payload: ctx.payload,
      user: ctx.user,
    })
  }),
})
