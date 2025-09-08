import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { StocksResults } from '@/widgets/remote-stocks-result'

export default async function page() {
  const payload = await getPayload({ config: configPromise })

  const suppliersList = await payload.find({
    collection: 'tenants',
    depth: 2,
    limit: 12,
  })

  const supplierWithApi = suppliersList.docs.filter((supplier) => supplier.apiUrl != null)

  return (
    <div className="py-24">
      <div className="container mb-16">
        <StocksResults
          suppliersList={supplierWithApi}
          searchParams={{
            sku: '',
            description: '',
            page: undefined,
            perPage: undefined,
          }}
        />
      </div>
    </div>
  )
}
