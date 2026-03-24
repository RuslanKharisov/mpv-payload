import { getMeUser } from '@/shared/utilities/getMeUser'
// import { TenantUsersTable } from '@/widgets/suppliers/users-table'

export default async function UsersPage() {
  const { user } = await getMeUser()
  const tenant = user?.tenants?.[0] ?? null

  if (!tenant) return null

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 md:py-6">
      <h1 className="text-lg font-semibold">Пользователи компании</h1>
      {/* <TenantUsersTable tenantId={tenant.id} /> */}
    </div>
  )
}
