import { SupplierDashboardClient } from '@/widgets/supplier-dashboard/page-client'
import { appRouter } from '@/shared/trpc/routers/_app'
import { createTRPCContext } from '@/shared/trpc/init'
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query'

export default async function SuppliersDashboardPage() {
  // Create the context and caller to prefetch data on the server
  const ctx = await createTRPCContext()
  const caller = appRouter.createCaller(ctx)
  const summary = await caller.dashboard.getSupplierSummary()

  // Create a query client and add the prefetched data
  const queryClient = new QueryClient()
  queryClient.setQueryData(['dashboard.getSupplierSummary'], summary)

  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <SupplierDashboardClient />
    </HydrationBoundary>
  )
}
