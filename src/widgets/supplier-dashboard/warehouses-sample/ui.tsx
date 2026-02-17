import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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
        <CardTitle className="text-lg">Ваши склады</CardTitle>
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
              <div>
                <div className="font-medium">{warehouse.title}</div>
                {warehouse.address && (
                  <div className="text-sm text-muted-foreground">{warehouse.address}</div>
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
