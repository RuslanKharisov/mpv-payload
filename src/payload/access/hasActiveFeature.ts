import type { Access, FieldAccess, BasePayload } from 'payload'
import type { User } from '@/payload-types'

type Feature = 'CAN_MANAGE_STOCK' | 'CAN_CREATE_POSTS' | 'CAN_PROMOTE_PRODUCTS'

// Оставьте ваши существующие утилиты как есть
export const getActiveTenantId = (user: User | null | undefined): string | number | null => {
  if (!user || !Array.isArray(user.tenants) || user.tenants.length === 0) {
    return null
  }
  const first = user.tenants[0]?.tenant
  if (!first) return null
  return typeof first === 'object' ? first.id : first
}

export const tenantHasActiveFeature = async (
  tenantId: string | number,
  feature: Feature,
  payload: BasePayload,
): Promise<boolean> => {
  if (!tenantId) return false

  try {
    const { docs: subscriptions } = await payload.find({
      collection: 'subscriptions',
      where: {
        tenant: { equals: tenantId },
        status: { equals: 'active' },
        endDate: { greater_than_equal: new Date().toISOString() },
      },
      depth: 1,
    })

    if (!subscriptions?.length) return false

    const activeSubscription = subscriptions[0]
    const tariff = activeSubscription.tariff

    if (
      typeof tariff === 'object' &&
      tariff !== null &&
      Array.isArray(tariff.features) &&
      tariff.features.includes(feature)
    ) {
      return true
    }
  } catch (error) {
    console.error('tenantHasActiveFeature error:', error)
    return false
  }

  return false
}
export const checkTenantFeatureAccess =
  (feature: Feature): Access & FieldAccess =>
  async ({ req }) => {
    const { user, payload } = req
    if (!user) return false

    if (user.roles?.includes('super-admin')) return true

    const activeTenantId = getActiveTenantId(user)
    if (!activeTenantId) return false

    return await tenantHasActiveFeature(activeTenantId, feature, payload)
  }
