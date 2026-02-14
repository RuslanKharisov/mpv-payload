import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { getMeUser } from '@/shared/utilities/getMeUser'
import { getUserTenantIDs } from '@/shared/utilities/getUserTenantIDs'
import { GoogleSheetsConfig } from '@/widgets/warehouses/google-config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Tenant } from '@/payload-types'
// import { LocalWarehouses } from '@/widgets/warehouses/local-warehouses'

export default async function WarehousesPage() {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  if (!user) {
    return null
  }

  const payload = await getPayload({ config: configPromise })

  const tenantIds = getUserTenantIDs(user)
  const currentTenantId = tenantIds[0]
  if (!currentTenantId) {
    return <div className="px-4 py-6">Нет привязанных компаний.</div>
  }

  const supplier = (await payload.findByID({
    collection: 'tenants',
    id: currentTenantId,
  })) as Tenant

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 md:py-6">
      <h1 className="text-2xl font-bold tracking-tight">Управление складами</h1>

      <Tabs defaultValue="local" className="w-full">
        <TabsList>
          <TabsTrigger value="local">Локальные склады (БД)</TabsTrigger>
          <TabsTrigger value="google">Google Таблицы (API)</TabsTrigger>
        </TabsList>

        <TabsContent value="local" className="pt-4">
          Локальные склады (БД)
          {/* Здесь будет список сущностей Warehouse и остатков Stock */}
          {/* <LocalWarehouses /> */}
        </TabsContent>

        <TabsContent value="google" className="pt-4">
          Google Таблицы (API)
          <GoogleSheetsConfig supplier={supplier} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
