import type { Access, BasePayload } from 'payload'
import { User, Tenant } from '@/payload-types'

/***
 * CAN_MANAGE_STOCK - доступ к созданию/изменению склада
 * CAN_CREATE_POSTS - доступ к созданию постов
 * CAN_PROMOTE_PRODUCTS - доступ к полю `isPromoted`
 ***/

type Feature = 'CAN_MANAGE_STOCK' | 'CAN_CREATE_POSTS' | 'CAN_PROMOTE_PRODUCTS'

// Достаём tenantId у пользователя
export const getActiveTenantId = (user: User | null | undefined): string | number | null => {
  if (!user || !Array.isArray(user.tenants) || user.tenants.length === 0) {
    return null
  }

  const first = user.tenants[0]?.tenant
  if (!first) return null

  return typeof first === 'object' ? first.id : first
}

// Хелпер для проверки, имеет ли тенант активную фичу
export const tenantHasActiveFeature = async (
  tenantId: string | number,
  feature: Feature,
  payload: BasePayload,
): Promise<boolean> => {
  if (!tenantId) return false

  try {
    // 1. Найти активную подписку для данного тенанта
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

    // 2. Проверить, есть ли у тарифа нужная фича
    if (typeof tariff === 'object' && tariff.features?.includes(feature)) {
      return true
    }
  } catch (error) {
    console.error('tenantHasActiveFeature error:', error)
    return false
  }

  return false
}

/**
 * Принимат в качестве аргумента
 * - CAN_MANAGE_STOCK - доступ к созданию/изменению склада
 * - CAN_CREATE_POSTS - доступ к созданию постов
 * - CAN_PROMOTE_PRODUCTS - доступ к полю `isPromoted`,
 * - Возвращает булевое значение
 * */
export const checkTenantFeatureAccess =
  (feature: Feature): Access =>
  async ({ req }) => {
    const { user, payload } = req
    if (!user) return false

    if (user.roles?.includes('super-admin')) return true

    const activeTenantId = getActiveTenantId(user)
    if (!activeTenantId) return false
    return await tenantHasActiveFeature(activeTenantId, feature, payload)
  }
