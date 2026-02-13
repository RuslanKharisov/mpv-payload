import { getMeUser } from '@/shared/utilities/getMeUser'

export default async function DashBoardPage() {
  const { user } = await getMeUser()

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 md:py-6">{/* таблица по stocks */}</div>
  )
}
