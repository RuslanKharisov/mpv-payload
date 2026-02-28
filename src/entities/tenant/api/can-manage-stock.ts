import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getMeUser } from '@/shared/utilities/getMeUser'
import { getActiveTenantId, tenantHasActiveFeature } from '@/payload/access/hasActiveFeature'

export async function canManageStockForCurrentTenant() {
  const { user } = await getMeUser()
  if (!user) return false

  // супер-админ — всегда можно
  if (user.roles?.includes('super-admin')) return true

  const activeTenantId = getActiveTenantId(user)
  if (!activeTenantId) return false

  const payload = await getPayload({ config: configPromise })

  return tenantHasActiveFeature(activeTenantId, 'CAN_MANAGE_STOCK', payload)
}
