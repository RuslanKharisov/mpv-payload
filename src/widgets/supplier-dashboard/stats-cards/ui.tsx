import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Typography } from '@/shared/ui/typography'
import { Package, Warehouse } from 'lucide-react'

export interface StatsCardsProps {
  warehousesCount: number
  stocksCount: number
  skuCount: number
  warehousesWithStock: number
}

export function StatsCards({
  warehousesCount,
  stocksCount,
  skuCount,
  warehousesWithStock,
}: StatsCardsProps) {
  return (
    <>
      {/* Warehouses Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Склады</CardTitle>
          <Warehouse className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2">
          <Typography tag="p" wrapper={false} className="text-lg font-bold">
            Общее количество складов: {warehousesCount}
          </Typography>
          <Typography tag="p" wrapper={false} className="text-xs text-muted-foreground">
            {warehousesWithStock > 0
              ? `склады с остатками: ${warehousesWithStock}`
              : 'Нет складов с остатками'}
          </Typography>
        </CardContent>
      </Card>

      {/* Stocks Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Записи остатков</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2">
          <Typography tag="p" wrapper={false} className="text-2xl font-bold">
            {stocksCount}
          </Typography>
          <Typography tag="p" wrapper={false} className="text-xs text-muted-foreground">
            Всего записей остатков в базе данных
          </Typography>
        </CardContent>
      </Card>

      {/* SKU Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Уникальные SKU</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2">
          <Typography tag="p" wrapper={false} className="text-2xl font-bold">
            {skuCount}
          </Typography>
          <Typography tag="p" wrapper={false} className="text-xs text-muted-foreground">
            Уникальных товаров на складах
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}
