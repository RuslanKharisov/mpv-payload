import { getSupplierDashboardSummary } from '@/entities/dashboard/api/get-supplier-dashboard-summary'
import { CompanyCard } from '@/widgets/supplier-dashboard/company-card'
import { UserCard } from '@/widgets/supplier-dashboard/user-card'
import { StatsCards } from '@/widgets/supplier-dashboard/stats-cards'
import { QuickLinksCard } from '@/widgets/supplier-dashboard/quick-links-card'
import { WarehousesSample } from '@/widgets/supplier-dashboard/warehouses-sample'
import { Card, CardContent } from '@/shared/ui/card'
import { Typography } from '@/shared/ui/typography'

export default async function SuppliersDashboardPage() {
  const summary = await getSupplierDashboardSummary()

  if (!summary) {
    return (
      <div className="px-4 lg:px-6 py-4 md:py-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Нет данных для отображения.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Проверьте, что у вас есть привязанная компания.
            </p>
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
        <p className="text-sm text-muted-foreground">Обзор вашей компании, складов и остатков.</p>
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
