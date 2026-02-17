import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
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
        <CardContent className="gap-y-3">
          <div className="text-2xl font-bold">Общее количество складов: {warehousesCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {warehousesWithStock > 0
              ? `${warehousesWithStock} склад (ов) с остатками`
              : 'Нет складов с остатками'}
          </p>
        </CardContent>
      </Card>

      {/* Stocks Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Записи остатков</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stocksCount}</div>
          <p className="text-xs text-muted-foreground">Всего записей остатков в базе данных</p>
        </CardContent>
      </Card>

      {/* SKU Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Уникальные SKU</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{skuCount}</div>
          <p className="text-xs text-muted-foreground">Уникальных товаров на складах</p>
        </CardContent>
      </Card>
    </>
  )
}
