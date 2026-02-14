import { ApiExternalProcedure, baseProcedure, createTRPCRouter } from '@/shared/trpc/init'
import { TRPCError } from '@trpc/server'
import z from 'zod'
import { buildRemoteUrlFromTenant } from '../../_domain/build-remote-url'
import { StockResponseSchema, type StockResponse } from '../../_domain/tstock-response'
import type { User } from '@/payload-types'
import type { Payload } from 'payload'

function userHasTenant(user: User, tenantId: number): boolean {
  return (
    user.tenants?.some((t) =>
      typeof t.tenant === 'object' ? t.tenant.id === tenantId : t.tenant === tenantId,
    ) ?? false
  )
}

interface FetchRemoteStockInput {
  tenantId: number
  page: number
  perPage: number
  filters: { sku: string; description: string }
}

async function fetchRemoteStock(
  payload: Payload,
  input: FetchRemoteStockInput,
): Promise<StockResponse> {
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

  // Parse JSON with error handling
  let rawData: unknown
  try {
    rawData = await response.json()
  } catch (parseError) {
    throw new TRPCError({
      code: 'BAD_GATEWAY',
      message: 'Failed to parse external API response as JSON',
    })
  }

  // Validate against Zod schema
  const validationResult = StockResponseSchema.safeParse(rawData)
  if (!validationResult.success) {
    throw new TRPCError({
      code: 'BAD_GATEWAY',
      message: `External API response validation failed: ${validationResult.error.message}`,
    })
  }

  return validationResult.data
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
    .output(StockResponseSchema)
    .query(async ({ ctx, input }) => {
      const { payload, user } = ctx
      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const isInternalStaff =
        user.roles?.some((role) => ['super-admin', 'admin'].includes(role)) ?? false

      if (!isInternalStaff && !userHasTenant(user, input.tenantId)) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Нет доступа к этому тенанту' })
      }

      return fetchRemoteStock(payload, input)
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
    .output(StockResponseSchema)
    .query(async ({ ctx, input }) => {
      const { payload } = ctx
      return fetchRemoteStock(payload, input)
    }),
})
