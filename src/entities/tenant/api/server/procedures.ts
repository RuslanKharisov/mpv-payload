import {
  DaDataCompanyResponseSchema,
  InnSchema,
  TenantUpdateSchema,
} from '@/entities/tenant/_domain'
import { baseProcedure, createTRPCRouter } from '@/shared/trpc/init'
import z from 'zod'
import { findCompanyByInn } from '../get-company-data-by-inn'
import { updateOrCreateTenant } from '../update-tenant'

export const tenantsRouter = createTRPCRouter({
  updateOrCreateTenant: baseProcedure.input(TenantUpdateSchema).mutation(async ({ input, ctx }) => {
    return await updateOrCreateTenant(input, { user: ctx.user, payload: ctx.payload })
  }),

  getCompanyByInn: baseProcedure
    .input(
      z.object({
        inn: InnSchema,
      }),
    )
    .output(DaDataCompanyResponseSchema) // <-- схема, не тип
    .query(async ({ input }) => {
      return findCompanyByInn(input.inn)
    }),
})
