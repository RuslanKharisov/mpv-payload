import { getTenants } from '@/entities/tenant/api/get-tenants'
import { generateMeta } from '@/shared/utilities/generateMeta'
import { StocksResults } from '@/widgets/remote-stocks-result'
import { StockSearchBar } from '@/widgets/stock-search-bar'
import { Metadata } from 'next'
import { Suspense } from 'react'

export default async function page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const sp = await searchParams
  const params = {
    sku: sp.sku ?? '',
    description: sp.description ?? '',
    page: sp.page ?? '1',
    perPage: sp.perPage ?? '5',
  }

  const suppliersList = await getTenants()
  const supplierWithApi = suppliersList.filter(
    (supplier) => supplier.apiUrl && supplier.apiUrl.trim().length > 0,
  )

  return (
    <div className="py-8 lg:py-24">
      <div className="container flex flex-col gap-12">
        <h1 className="text-center">Поиск оборудования на складах</h1>
        <Suspense fallback={<StocksSkeleton />}>
          <StockSearchBar />
          <StocksResults suppliersList={supplierWithApi} searchParams={params} />
        </Suspense>
      </div>
    </div>
  )
}

function StocksSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
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
