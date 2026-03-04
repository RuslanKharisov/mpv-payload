import { User } from '@/payload-types'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getClientSideURL } from './getURL'
import { cache } from 'react' // 1. Импортируем cache

// 2. Создаем чистую функцию получения данных, обернутую в cache
// Она будет вызываться 10 раз, но сетевой запрос уйдет только 1 раз
export const getCachedUser = cache(
  async (token?: string): Promise<{ user: User | null; token: string | undefined }> => {
    if (!token) return { user: null, token: undefined }

    const meUserReq = await fetch(`${getClientSideURL()}/api/users/me`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
      // Next.js кэширует fetch по умолчанию, но для надежности в RSC:
      next: { tags: ['user-me'] },
    })

    if (!meUserReq.ok) return { user: null, token }

    const { user }: { user: User } = await meUserReq.json()
    return { user, token }
  },
)

// 3. Основная функция (экспорт остается прежним для совместимости)
export const getMeUser = async (args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
}): Promise<{
  token: string
  user: User
}> => {
  const { nullUserRedirect, validUserRedirect } = args || {}
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  // Вызываем кэшированную версию
  const { user } = await getCachedUser(token)

  // Логика редиректов должна быть ВНЕ React.cache
  if (validUserRedirect && user) {
    redirect(validUserRedirect)
  }

  if (nullUserRedirect && !user) {
    redirect(nullUserRedirect)
  }

  return {
    token: token!,
    user: user!,
  }
}
