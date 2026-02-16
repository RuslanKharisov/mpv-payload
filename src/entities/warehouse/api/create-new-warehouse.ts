'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getMeUser } from '@/shared/utilities/getMeUser'
import { getActiveTenantId, tenantHasActiveFeature } from '@/payload/access/hasActiveFeature'
import type { Warehouse } from '@/payload-types'
import type { CreateWarehouseInput, CreateWarehouseResult } from '../model/types'

export async function createNewWarehouse(
  input: CreateWarehouseInput,
): Promise<CreateWarehouseResult> {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  if (!user) {
    return { success: false, error: 'Не авторизовано' }
  }

  const payload = await getPayload({ config: configPromise })

  // Super-admin has access in any case
  const isSuperAdmin = user.roles?.includes('super-admin')

  const tenantId = getActiveTenantId(user)
  if (!tenantId) {
    return { success: false, error: 'Не найден активный проект компании' }
  }

  // Check CAN_MANAGE_STOCK feature for current tenant
  console.log(
    '[createNewWarehouse] Checking feature for tenant:',
    tenantId,
    'isSuperAdmin:',
    isSuperAdmin,
  )

  const hasFeature = isSuperAdmin
    ? true
    : await tenantHasActiveFeature(tenantId, 'CAN_MANAGE_STOCK', payload)

  console.log('[createNewWarehouse] hasFeature:', hasFeature)

  if (!hasFeature) {
    return {
      success: false,
      error: 'Нет доступа к управлению складами. Проверьте активную подписку и тариф.',
    }
  }

  if (!input.title.trim()) {
    return { success: false, error: 'Укажите название склада' }
  }

  try {
    // Note: capacity and isDefault are NOT taken from client input
    // These are set by admin/tariff on server side only
    const doc = await payload.create({
      collection: 'warehouses',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        title: input.title.trim(),
        tenant: tenantId as number,
        // selectedAddressData stores the raw DaData response for future use
        selectedAddressData: input.addressData as Record<string, unknown>,
        // capacity is not set here - it will use default from collection config
        // or be set by super-admin later
      } as any,
    })

    return { success: true, warehouse: { id: String((doc as Warehouse).id) } }
  } catch (e) {
    console.error('createNewWarehouse error:', e)
    return { success: false, error: 'Не удалось создать склад' }
  }
}
