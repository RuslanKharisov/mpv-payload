import { getUserTenantIDs } from '@/shared/utilities/getUserTenantIDs'
import { isSuperAdmin } from '@/payload/access/isSuperAdmin'
import { TenantUpdateInput } from '../../_domain/schemas'
import type { Tenant, User } from '@/payload-types'
import type { Payload } from 'payload'

// Helper function to convert tenant entity to response object
function toTenantResponse(tenant: Tenant) {
  return {
    id: String(tenant.id),
    name: tenant.name,
    slug: tenant.slug,
    domain: tenant.domain || undefined,
    requestEmail: tenant.requestEmail,
    createdAt: tenant.createdAt,
  }
}

interface UpdateOrCreateTenantDeps {
  user: User
  payload: Payload
}

/**
 * Helper function to create or update a tenant
 * Ensures tenant isolation and proper access control
 */
export async function updateOrCreateTenant(
  input: TenantUpdateInput,
  deps: UpdateOrCreateTenantDeps,
) {
  const { user, payload } = deps

  if (!user) {
    throw new Error('Пользователь не авторизован')
  }

  const userTenantIds = getUserTenantIDs(user)

  if (input.id) {
    const tenantId = Number(input.id)
    if (!userTenantIds.includes(tenantId)) {
      throw new Error('У вас нет доступа к этому тенанту')
    }

    if (input.status && input.status !== 'ACTIVE') {
      throw new Error(`Нельзя использовать недействующую компанию (статус: ${input.status}).`)
    }

    if (input.inn) {
      const existing = await payload.find({
        collection: 'tenants',
        where: {
          inn: { equals: input.inn },
          id: { not_equals: tenantId },
        },
        limit: 1,
      })

      if (existing.docs && existing.docs.length > 0) {
        throw new Error('Поставщик с таким ИНН уже существует')
      }
    }

    // Update the tenant
    const updatedTenant = await payload.update({
      collection: 'tenants',
      id: tenantId,
      data: {
        name: input.name,
        requestEmail: input.requestEmail,
        domain: input.domain,
        inn: input.inn,
        status: input.status,
        accountDetailsSubmitted: true,
      },
    })

    // Return a safe representation of the tenant
    return toTenantResponse(updatedTenant)
  } else {
    const userIsSuperAdmin = isSuperAdmin(user)
    if (!userIsSuperAdmin) {
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
    return toTenantResponse(newTenant)
  }
}
