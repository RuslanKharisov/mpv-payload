import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getMeUser } from '@/shared/utilities/getMeUser'
import { getUserTenantIDs } from '@/shared/utilities/getUserTenantIDs'
import { getWarehousesByTenant } from '@/entities/warehouse/api/get-warehouses-by-tenant'
import { CreateWarehouseDialog } from '@/features/create-warehouse-dialog'
import { WarehousesTable } from '@/widgets/warehouses-table'
import { tenantHasActiveFeature } from '@/payload/access/hasActiveFeature'

export default async function WarehousesPage() {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  if (!user) {
    return null
  }

  // Get tenant ID from user and pass only the ID (not the full user object) for security
  const tenantIds = getUserTenantIDs(user)
  const currentTenantId = tenantIds[0]
  if (!currentTenantId) {
    return <div className="px-4 py-6">Нет привязанных компаний.</div>
  }

  // Check if user has CAN_MANAGE_STOCK feature (super-admins always have access)
  const payload = await getPayload({ config: configPromise })
  const isSuperAdmin = user.roles?.includes('super-admin')
  const canManageStock = isSuperAdmin
    ? true
    : await tenantHasActiveFeature(currentTenantId, 'CAN_MANAGE_STOCK', payload)

  // Fetch warehouses for the current tenant
  const warehouses = await getWarehousesByTenant(currentTenantId)

  return (
    <div className="space-y-4 px-4 lg:px-6 py-4 md:py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Склады</h1>
          <p className="text-sm text-muted-foreground">
            Управление вашими складами: название и адрес для импорта остатков.
          </p>
        </div>
        {canManageStock && <CreateWarehouseDialog />}
      </div>

      {warehouses.length > 0 ? (
        <WarehousesTable initialData={warehouses} />
      ) : (
        <div className="rounded-md border p-8 text-center">
          <p className="text-muted-foreground">У вас пока нет созданных складов.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Нажмите «Создать склад», чтобы добавить первый склад.
          </p>
        </div>
      )}
    </div>
  )
}
