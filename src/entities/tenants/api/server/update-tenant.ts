import { getMeUser } from '@/shared/utilities/getMeUser'
import { getUserTenantIDs } from '@/shared/utilities/getUserTenantIDs'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { TenantUpdateInput } from '../../_domain/schemas'

/**
 * Helper function to create or update a tenant
 * Ensures tenant isolation and proper access control
 */
export async function updateOrCreateTenant(input: TenantUpdateInput) {
  const { user } = await getMeUser({ nullUserRedirect: '/login' })
  if (!user) {
    throw new Error('Пользователь не авторизован')
  }

  const payload = await getPayload({ config: configPromise })

  // Check if user has permissions to manage this tenant
  const userTenantIds = getUserTenantIDs(user)

  if (input.id) {
    // Update case - check if user has access to this tenant
    const tenantId = Number(input.id)
    if (!userTenantIds.some((id) => id === tenantId)) {
      throw new Error('У вас нет доступа к этому тенанту')
    }

    // Update the tenant
    const updatedTenant = await payload.update({
      collection: 'tenants',
      id: tenantId,
      data: {
        name: input.name,
        requestEmail: input.requestEmail,
        domain: input.domain,
      },
    })

    // Return a safe representation of the tenant
    return {
      id: String(updatedTenant.id),
      name: updatedTenant.name,
      slug: updatedTenant.slug,
      domain: updatedTenant.domain || undefined,
      requestEmail: updatedTenant.requestEmail,
      createdAt: updatedTenant.createdAt,
    }
  } else {
    // Create case - only super admins can create tenants directly
    const isSuperAdmin = user.roles?.includes('super-admin')
    if (!isSuperAdmin) {
      throw new Error('Только супер-администраторы могут создавать тенанты напрямую')
    }

    // Create the tenant
    const newTenant = await payload.create({
      collection: 'tenants',
      data: {
        name: input.name,
        requestEmail: input.requestEmail,
        domain: input.domain,
      },
      draft: false,
    })

    // Return a safe representation of the tenant
    return {
      id: String(newTenant.id),
      name: newTenant.name,
      slug: newTenant.slug,
      domain: newTenant.domain || undefined,
      requestEmail: newTenant.requestEmail,
      createdAt: newTenant.createdAt,
    }
  }
}
