import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Typography } from '@/shared/ui/typography'

export interface WarehousesSampleItem {
  id: string
  title: string
  address?: string
}

export interface WarehousesSampleProps {
  warehousesSample: WarehousesSampleItem[]
  warehousesCount: number
}

export function WarehousesSample({ warehousesSample, warehousesCount }: WarehousesSampleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Ваши склады</CardTitle>
        <CardDescription>
          {warehousesCount > warehousesSample.length
            ? `Показано ${warehousesSample.length} из ${warehousesCount} складов`
            : `Всего складов: ${warehousesCount}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {warehousesSample.map((warehouse) => (
            <div
              key={warehouse.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div className="flex flex-col gap-y-1">
                <Typography tag="p" wrapper={false} className="text-lg font-bold">
                  {warehouse.title}
                </Typography>
                {warehouse.address && (
                  <Typography tag="p" wrapper={false} className="text-xs text-muted-foreground">
                    {warehouse.address}
                  </Typography>
                )}
              </div>
            </div>
          ))}
        </div>
        {warehousesCount > warehousesSample.length && (
          <div className="mt-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/suppliers/warehouses">
                Посмотреть все склады
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
