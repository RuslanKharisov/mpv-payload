'use server'

import { logout } from '@payloadcms/next/auth'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function logoutAction() {
  try {
    await logout({
      allSessions: true,
      config: configPromise,
    })

    // Перевалидируем кэш
    revalidatePath('/clients')
    revalidatePath('/admin')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    throw new Error(
      `Выход не удался: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
    )
  }
}
