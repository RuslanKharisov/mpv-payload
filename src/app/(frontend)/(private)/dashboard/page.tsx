import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { SupplierDashboardClient } from '@/widgets/supplier-dashboard/page-client'
import { getQueryClient, trpc } from '@/shared/trpc/server'

export default async function SuppliersDashboardPage() {
  const queryClient = getQueryClient()

  const queryOptions = trpc.dashboard.getSupplierSummary.queryOptions()

  await queryClient.prefetchQuery(queryOptions)

  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <SupplierDashboardClient />
    </HydrationBoundary>
  )
}
