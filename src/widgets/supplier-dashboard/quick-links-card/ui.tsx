import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function QuickLinksCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Быстрые ссылки</CardTitle>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-col gap-y-1">
          <Button asChild variant="destructive" className="w-full justify-between" size="sm">
            <Link href="/suppliers/warehouses">
              Управление складами
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="default" className="w-full justify-between" size="sm">
            <Link href="/suppliers/stocks">
              Остатки и цены
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
