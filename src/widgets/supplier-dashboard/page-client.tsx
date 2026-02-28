'use client'

import { CompleteCompanyModal } from '@/features/complete-tenant-onboarding'
import { useTRPC } from '@/shared/trpc/client'
import { Card, CardContent } from '@/shared/ui/card'
import { Spinner } from '@/shared/ui/spinner'
import { Typography } from '@/shared/ui/typography'
import { CompanyCard } from '@/widgets/supplier-dashboard/company-card'
import { QuickLinksCard } from '@/widgets/supplier-dashboard/quick-links-card'
import { StatsCards } from '@/widgets/supplier-dashboard/stats-cards'
import { UserCard } from '@/widgets/supplier-dashboard/user-card'
import { WarehousesSample } from '@/widgets/supplier-dashboard/warehouses-sample'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export function SupplierDashboardClient() {
  const trpc = useTRPC()

  const queryOptions = useMemo(() => trpc.dashboard.getSupplierSummary.queryOptions(), [trpc])

  const { data: summary, isLoading } = useQuery({ ...queryOptions })

  if (summary?.needsCompanyCompletion) {
    return <CompleteCompanyModal tenant={summary.tenant} />
  }

  if (isLoading) {
    return <Spinner className="mt-20" />
  }

  if (!summary) {
    return (
      <div className="px-4 lg:px-6 py-4 md:py-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Typography tag="p" className="text-muted-foreground">
              Нет данных для отображения.
            </Typography>
            <Typography tag="p" className="text-sm text-muted-foreground mt-1">
              Проверьте, что у вас есть привязанная компания.
            </Typography>
          </CardContent>
        </Card>
      </div>
    )
  }

  const {
    user,
    tenant,
    warehousesCount,
    stocksCount,
    skuCount,
    warehousesWithStock,
    warehousesSample,
  } = summary

  return (
    <div className="space-y-6 px-4 lg:px-6 py-4 md:py-6">
      <div className="space-y-2">
        <Typography tag="h1">Дашборд поставщика</Typography>
        <Typography tag="p" className="text-sm text-muted-foreground">
          Обзор вашей компании, складов и остатков.
        </Typography>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CompanyCard tenant={tenant} />
        <UserCard user={user} />
        <StatsCards
          warehousesCount={warehousesCount}
          stocksCount={stocksCount}
          skuCount={skuCount}
          warehousesWithStock={warehousesWithStock}
        />
        <QuickLinksCard />
      </div>

      {warehousesSample.length > 0 && (
        <WarehousesSample warehousesSample={warehousesSample} warehousesCount={warehousesCount} />
      )}
    </div>
  )
}
