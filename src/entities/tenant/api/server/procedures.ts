import { baseProcedure, createTRPCRouter } from '@/shared/trpc/init'
import { Payload } from 'payload'
import { updateOrCreateTenant } from '../../../tenants/api/server/update-tenant'
import { TenantUpdateSchema } from '../../../tenants/_domain/schemas'

export const tenantsRouter = createTRPCRouter({
  tenant: baseProcedure.query(async ({ ctx }) => {
    const payload: Payload = ctx.payload

    const suppliersList = await payload.find({
      collection: 'tenants',
      depth: 2,
      limit: 1000,
    })

    const supplierWithApi = suppliersList.docs.filter((supplier) => supplier.apiUrl != null)

    return supplierWithApi
  }),

  updateOrCreateTenant: baseProcedure.input(TenantUpdateSchema).mutation(async ({ input, ctx }) => {
    // Pass the context user and payload to avoid redundant fetch
    return await updateOrCreateTenant(input, { user: ctx.user, payload: ctx.payload })
  }),
})
