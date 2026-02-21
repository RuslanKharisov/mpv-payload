import { getTenants } from '@/entities/tenant/api/get-tenants'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card'
import { generateMeta } from '@/shared/utilities/generateMeta'
import { StockSearchBar } from '@/widgets/stock-search-bar'
import { Building2, ExternalLink } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const sp = await searchParams

  const suppliersList = await getTenants()
  const supplierWithApi = suppliersList.filter(
    (supplier) => supplier.apiUrl && supplier.apiUrl.trim().length > 0,
  )

  return (
    <div className="py-8 lg:py-24">
      <div className="container flex flex-col gap-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Поиск оборудования на складах</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Выберите поставщика для просмотра актуальных остатков
          </p>
        </div>

        <Suspense fallback={<StocksSkeleton />}>
          <StockSearchBar />

          {/* Карточки поставщиков */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {supplierWithApi.map((supplier) => (
              <Card key={supplier.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {supplier.meta?.description || 'Поставщик компонентов АСУ ТП'}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/supplier/${supplier.slug}?tab=google`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Остатки
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {supplierWithApi.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Нет доступных поставщиков для поиска.</p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}

function StocksSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
      ))}
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const pseudoDoc = {
    meta: {
      title: 'Поиск компонентов АСУ ТП на складах',
      description:
        'Prom-Stock.ru: Быстрый поиск оборудования, компонентов АСУ ТП, электроприводов и неликвидов по всей России.',
      slug: 'stock',
    },
  }

  return generateMeta({ doc: pseudoDoc })
}
