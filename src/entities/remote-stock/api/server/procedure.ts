import { ApiExternalProcedure, baseProcedure, createTRPCRouter } from '@/shared/trpc/init'
import { TRPCError } from '@trpc/server'
import z from 'zod'
import { buildRemoteUrlFromTenant } from '../../_domain/build-remote-url'
import type { StockResponse } from '../../_domain/tstock-response'
import type { User } from '@/payload-types'

function userHasTenant(user: User, tenantId: number): boolean {
  return (
    user.tenants?.some((t) =>
      typeof t.tenant === 'object' ? t.tenant.id === tenantId : t.tenant === tenantId,
    ) ?? false
  )
}

export const remoteStocksRouter = createTRPCRouter({
  getByUrl: baseProcedure
    .input(
      z.object({
        tenantId: z.number().int(),
        page: z.number().int().min(1).default(1),
        perPage: z.number().int().min(1).max(100).default(5),
        filters: z.object({
          sku: z.string().default(''),
          description: z.string().default(''),
        }),
      }),
    )
    .output(z.custom<StockResponse>())
    .query(async ({ ctx, input }) => {
      const { payload, user } = ctx as { payload: any; user: User | null }

      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const isInternalStaff =
        user.roles?.some((role) => ['super-admin', 'admin'].includes(role)) ?? false

      if (!isInternalStaff && !userHasTenant(user, input.tenantId)) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Нет доступа к этому тенанту' })
      }

      let tenant
      try {
        tenant = await payload.findByID({
          collection: 'tenants',
          id: input.tenantId,
        })
      } catch {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Тенант не найден' })
      }

      const urlStr = buildRemoteUrlFromTenant({
        tenant,
        filters: input.filters,
        pagination: { page: input.page, perPage: input.perPage },
      })

      const response = await fetch(urlStr, { next: { revalidate: 60 } })

      if (!response.ok) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: `HTTP error! status: ${response.status}`,
        })
      }

      const data: StockResponse = await response.json()
      return data
    }),

  getByUrlPublic: ApiExternalProcedure.input(
    z.object({
      tenantId: z.number().int(),
      page: z.number().int().min(1).default(1),
      perPage: z.number().int().min(1).max(100).default(5),
      filters: z.object({
        sku: z.string().default(''),
        description: z.string().default(''),
      }),
    }),
  )
    .output(z.custom<StockResponse>())
    .query(async ({ ctx, input }) => {
      const { payload, user } = ctx as { payload: any; user: User | null }

      let tenant
      try {
        tenant = await payload.findByID({
          collection: 'tenants',
          id: input.tenantId,
        })
      } catch {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Тенант не найден' })
      }

      const urlStr = buildRemoteUrlFromTenant({
        tenant,
        filters: input.filters,
        pagination: { page: input.page, perPage: input.perPage },
      })

      const response = await fetch(urlStr, { next: { revalidate: 60 } })

      if (!response.ok) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: `HTTP error! status: ${response.status}`,
        })
      }

      const data: StockResponse = await response.json()
      return data
    }),
})
