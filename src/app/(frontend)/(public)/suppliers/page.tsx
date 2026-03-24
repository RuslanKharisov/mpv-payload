import { FiltersProvider } from '@/shared/providers/Filters'
import { getTenantsCatalog } from '@/entities/tenant/api/get-tenants-catalog'
import { TenantsCatalogView } from '@/views/tenants/ui/tenants-catalog-view'

type Args = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams: paramsPromise }: Args) {
  const params = await paramsPromise

  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)
  const tagSlugs = Array.isArray(params.tags) ? params.tags.join(',') : params.tags

  const { tenants, pagination, countries, tags, totalDocs } = await getTenantsCatalog({
    page: first(params.page),
    country: first(params.country),
    tagSlugs,
    hasStock: first(params.hasStock),
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
