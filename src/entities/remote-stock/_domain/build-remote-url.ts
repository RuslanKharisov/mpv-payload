import { Tenant } from '@/payload-types'

export type RemoteFilters = {
  sku: string
  description: string
}

export type RemotePagination = {
  page: number
  perPage: number
}

export function buildRemoteUrlFromTenant(params: {
  tenant: Pick<Tenant, 'apiUrl' | 'apiToken'>
  filters: RemoteFilters
  pagination: RemotePagination
}): string {
  const { tenant, filters, pagination } = params

  if (!tenant.apiUrl || !tenant.apiToken) {
    throw new Error('Внешний источник не настроен (apiUrl/apiToken отсутствуют)')
  }

  const searchQuery = JSON.stringify(filters)

  let url: URL
  try {
    url = new URL(tenant.apiUrl)
  } catch {
    throw new Error('Некорректный apiUrl у тенанта')
  }

  url.searchParams.set('token', tenant.apiToken)
  url.searchParams.set('page', String(pagination.page))
  url.searchParams.set('per_page', String(pagination.perPage))
  url.searchParams.set('filters', searchQuery)

  return url.toString()
}
