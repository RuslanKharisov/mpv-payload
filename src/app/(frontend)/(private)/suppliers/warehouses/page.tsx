import { getMeUser } from '@/shared/utilities/getMeUser'
import { getWarehousesByTenant } from '@/entities/warehouse/api/get-warehouses-by-tenant'
import { CreateWarehouseDialog } from '@/features/create-warehouse-dialog'
import { WarehousesTable } from '@/widgets/warehouses-table'

export default async function WarehousesPage() {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  if (!user) {
    return null
  }

  // Fetch warehouses for the current tenant
  const warehouses = await getWarehousesByTenant(user)

  return (
    <div className="space-y-4 px-4 lg:px-6 py-4 md:py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Склады</h1>
          <p className="text-sm text-muted-foreground">
            Управление вашими складами: название и адрес для импорта остатков.
          </p>
        </div>
        <CreateWarehouseDialog />
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
