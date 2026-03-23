import { FiltersProvider } from '@/shared/providers/Filters'
import { getTenantsCatalog } from '@/entities/tenant/api/get-tenants-catalog'
import { TenantsCatalogView } from '@/views/tenants/ui/tenants-catalog-view'

export default async function Page({
  searchParams: paramsPromise,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await paramsPromise

  const { tenants, pagination, countries, tags, totalDocs } = await getTenantsCatalog({
    page: params.page,
    country: params.country,
    tagSlugs: params.tags, // "tag1,tag2"
    hasStock: params.hasStock, // "1" / "0"
  })

  return (
    <FiltersProvider basePath="/suppliers">
      <TenantsCatalogView
        tenants={tenants}
        pagination={pagination}
        countries={countries}
        tags={tags}
        totalDocs={totalDocs}
      />
    </FiltersProvider>
  )
}
