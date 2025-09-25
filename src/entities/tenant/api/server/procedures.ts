import { baseProcedure, createTRPCRouter } from '@/shared/trpc/init'
import { Payload } from 'payload'

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
})
