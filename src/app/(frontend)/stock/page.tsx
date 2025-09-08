import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { StocksResults } from '@/widgets/remote-stocks-result'
import { StockSearchBar } from '@/widgets/stock-search-bar'
import { SearchParams } from '@/widgets/remote-stocks-result/_ui/stocks-results'

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

  const payload = await getPayload({ config: configPromise })

  const suppliersList = await payload.find({
    collection: 'tenants',
    depth: 2,
    limit: 12,
  })

  const supplierWithApi = suppliersList.docs.filter((supplier) => supplier.apiUrl != null)

  return (
    <div className="py-8">
      <div className="container flex flex-col gap-12">
        <h1 className="text-center">Поиск оборудования на складах</h1>
        <StockSearchBar />
        <StocksResults suppliersList={supplierWithApi} searchParams={params} />
      </div>
    </div>
  )
}
