import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getMeUser } from '@/shared/utilities/getMeUser'
import { getUserTenantIDs } from '@/shared/utilities/getUserTenantIDs'
import { getWarehousesByTenant } from '@/entities/warehouse/api/get-warehouses-by-tenant'
import { CreateWarehouseDialog } from '@/features/create-warehouse-dialog'
import { WarehousesTable } from '@/widgets/warehouses-table'
import { tenantHasActiveFeature } from '@/payload/access/hasActiveFeature'
import { Typography } from '@/shared/ui/typography'
import Link from 'next/link'

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
          <Typography tag="h1" className="text-xl font-semibold">
            Управление адресами складов
          </Typography>
          <Typography tag="p" className="text-sm text-muted-foreground">
            Здесь вы можете создавать склады, адрес нахождения и указывать в поле местонахождение
            остатков. Это позволяет в поиске проводить фильтрацию по месту нахождения склада и
            находить товар с наименьшим логистическим плечом.
          </Typography>
        </div>
        {canManageStock && <CreateWarehouseDialog />}
      </div>

      {warehouses.length > 0 ? (
        <WarehousesTable initialData={warehouses} />
      ) : (
        <div className="rounded-md border p-8 text-center">
          <Typography tag="p" className="text-muted-foreground">
            У вас пока нет складов.
          </Typography>
          <Typography tag="p">
            Доступ открывается начиная с тарифа:{' '}
            <Link
              href="/suppliers/billing"
              className="text-accent-foreground hover:text-destructive transition-colors duration-300"
            >
              СТАРТ
            </Link>{' '}
          </Typography>
          {/* <p className="text-sm text-muted-foreground mt-1">
            Нажмите «Создать склад», чтобы добавить первый склад.
          </p> */}
        </div>
      )}
    </div>
  )
}
