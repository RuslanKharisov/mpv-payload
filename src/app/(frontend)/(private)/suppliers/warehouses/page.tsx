import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { getMeUser } from '@/shared/utilities/getMeUser'
import { getUserTenantIDs } from '@/shared/utilities/getUserTenantIDs'
import { getStocksByTenant } from '@/entities/stocks/api/get-stocks-by-tenant'
import { GoogleSheetsConfig } from '@/widgets/warehouses/google-config'
import { LocalWarehouses } from '@/widgets/warehouses/local-warehouses'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Tenant } from '@/payload-types'

interface WarehousesPageProps {
  searchParams: Promise<Record<string, string>>
}

export default async function WarehousesPage({ searchParams }: WarehousesPageProps) {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  if (!user) {
    return null
  }

  // Parse search params for pagination
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page, 10) || 1)
  const perPage = Math.min(100, Math.max(1, parseInt(sp.perPage, 10) || 20))

  const payload = await getPayload({ config: configPromise })

  const tenantIds = getUserTenantIDs(user)
  const currentTenantId = tenantIds[0]
  if (!currentTenantId) {
    return <div className="px-4 py-6">Нет привязанных компаний.</div>
  }

  let supplier: Tenant
  try {
    supplier = await payload.findByID({
      collection: 'tenants',
      id: currentTenantId,
    })
  } catch {
    return <div className="px-4 py-6">Компания не найдена.</div>
  }

  // Fetch local stocks for the tenant (pass user to avoid double auth)
  const { data: stocks, total } = await getStocksByTenant({ page, perPage }, user)

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 md:py-6">
      <h1 className="text-2xl font-bold tracking-tight">Управление складами</h1>

      <Tabs defaultValue="local" className="w-full">
        <TabsList>
          <TabsTrigger value="local">Локальные склады (БД)</TabsTrigger>
          <TabsTrigger value="google">Google Таблицы (API)</TabsTrigger>
        </TabsList>

        <TabsContent value="local" className="pt-4">
          <LocalWarehouses
            initialData={stocks}
            total={total}
            initialPage={page}
            initialPerPage={perPage}
          />
        </TabsContent>

        <TabsContent value="google" className="pt-4">
          Google Таблицы (API)
          <GoogleSheetsConfig supplier={supplier} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
