import { caller as serverClient } from '@/shared/trpc/server'
import { StockResponse } from '@/entities/remote-stock/_domain/tstock-response'
import { GoogleStock } from './google-stock'
import { Tenant } from '@/payload-types'

export async function SupplierStockLoader({
  supplier,
  filters,
  pagination,
}: {
  supplier: Tenant
  filters: { sku: string; description: string }
  pagination: { page: string; perPage: string }
}) {
  const searchQuery = JSON.stringify(filters)
  const url = `${supplier.apiUrl}?token=${supplier.apiToken}&page=${pagination.page}&per_page=${pagination.perPage}&filters=${searchQuery}`

  try {
    const response: StockResponse = await serverClient.remoteStocks.getByUrl({ url })

    if (!response?.data?.length) {
      return <div className="text-gray-500 text-sm px-4">Нет результатов по данному фильтру.</div>
    }

    return (
      <GoogleStock
        dataArray={response.data ?? []}
        count={response.meta.total ?? 0}
        supplier={supplier}
      />
    )
  } catch (err) {
    console.error(`💥 ${supplier.name}: ошибка запроса`, err)
    return (
      <div className="text-red-500 text-sm px-4">Ошибка загрузки данных от {supplier.name}</div>
    )
  }
}
