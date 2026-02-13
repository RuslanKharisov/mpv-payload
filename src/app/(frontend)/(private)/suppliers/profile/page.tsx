import { getMeUser } from '@/shared/utilities/getMeUser'
// import { TenantProfileForm } from '@/widgets/suppliers/tenant-profile-form'

export default async function ProfilePage() {
  const { user } = await getMeUser()
  const tenant = user?.tenants?.[0] ?? null

  if (!tenant) return null

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 md:py-6">
      <h1 className="text-lg font-semibold">Профиль компании</h1>
      {/* <TenantProfileForm tenantId={tenant.id} /> */}
    </div>
  )
}
