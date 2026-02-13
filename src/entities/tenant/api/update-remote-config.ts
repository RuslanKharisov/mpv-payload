'use server'

import { getMeUser } from '@/shared/utilities/getMeUser'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'

export interface UpdateRemoteConfigResult {
  success: boolean
  error?: string
  tenant?: any
}

export async function updateRemoteConfig(formData: FormData): Promise<UpdateRemoteConfigResult> {
  const payload = await getPayload({ config })

  try {
    const { user } = await getMeUser()

    if (!user) {
      return { success: false, error: 'Пользователь не авторизован' }
    }

    const tenant = user.tenants?.[0]?.tenant

    if (!tenant) {
      return { success: false, error: 'У пользователя нет привязанного тенанта' }
    }

    const tenantId = typeof tenant === 'object' && 'id' in tenant ? tenant.id : tenant

    const apiUrl = formData.get('apiUrl') as string
    const apiToken = formData.get('apiToken') as string
    const apiType = formData.get('apiType') as string

    // Обновляем тенант
    const updatedTenant = await payload.update({
      collection: 'tenants',
      id: tenantId,
      data: {
        apiUrl: apiUrl,
        apiToken: apiToken,
        apiType: 'google',
      },
    })

    revalidatePath('/suppliers/warehouses')

    return { success: true, tenant: updatedTenant }
  } catch (error) {
    console.error('Error updating remote config:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка при обновлении конфигурации',
    }
  }
}
