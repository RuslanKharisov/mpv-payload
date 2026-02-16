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

  const tenantIdRaw = getActiveTenantId(user)
  if (!tenantIdRaw) {
    return { success: false, error: 'Не найден активный проект компании' }
  }

  // Validate and convert tenantId to number
  const tenantId = typeof tenantIdRaw === 'string' ? parseInt(tenantIdRaw, 10) : tenantIdRaw
  if (Number.isNaN(tenantId)) {
    return { success: false, error: 'Некорректный идентификатор компании' }
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

  // Validate input payload
  if (!input || typeof input.title !== 'string') {
    return { success: false, error: 'Укажите название склада' }
  }

  if (!input.title.trim()) {
    return { success: false, error: 'Укажите название склада' }
  }

  try {
    // Note: capacity and isDefault are NOT taken from client input
    // These are set by admin/tariff on server side only
    // The beforeChange hook will resolve selectedAddressData into warehouse_address
    const doc = await payload.create({
      collection: 'warehouses',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        title: input.title.trim(),
        tenant: tenantId,
        // selectedAddressData is processed by the beforeChange hook to create/update
        // the warehouse_address relationship. The hook sets warehouse_address and deletes this field.
        selectedAddressData: input.addressData as Record<string, unknown>,
      } as any,
    })

    return { success: true, warehouse: { id: String((doc as Warehouse).id) } }
  } catch (e) {
    console.error('createNewWarehouse error:', e)
    return { success: false, error: 'Не удалось создать склад' }
  }
}
