import { getMeUser } from '@/shared/utilities/getMeUser'
// import { RequestsTable } from '@/widgets/suppliers/requests-table'

export default async function RequestsPage() {
  const { user } = await getMeUser()
  const tenant = user?.tenants?.[0] ?? null

  if (!tenant) return null

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 md:py-6">
      <h1 className="text-lg font-semibold">Заявки</h1>
      {/* <RequestsTable tenantId={tenant.id} /> */}
    </div>
  )
}
