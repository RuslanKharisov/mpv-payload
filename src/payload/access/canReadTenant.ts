import { Access } from 'payload'
import { User } from '@/payload-types'
import { getUserTenantIDs } from '@/shared/utilities/getUserTenantIDs'

export const canReadTenant: Access = ({ req }) => {
  const user = req?.user as User | null | undefined
  if (!user) return false

  // Суперадмины/админы видят всех
  const isInternalStaff =
    user.roles?.some((role) => ['super-admin', 'admin'].includes(role)) ?? false
  if (isInternalStaff) return true

  // Остальные — только свои тенанты
  const tenantIDs = getUserTenantIDs(user)
  return tenantIDs.length > 0 ? { id: { in: tenantIDs } } : false
}
