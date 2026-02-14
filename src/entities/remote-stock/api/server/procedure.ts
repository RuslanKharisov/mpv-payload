import { ApiExternalProcedure, createTRPCRouter } from '@/shared/trpc/init'
import { TRPCError } from '@trpc/server'
import z from 'zod'
import { StockResponse } from '../../_domain/tstock-response'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { buildRemoteUrlFromTenant } from '../../_domain/build-remote-url'

export const remoteStocksRouter = createTRPCRouter({
  getByUrl: ApiExternalProcedure.input(
    z.object({
      tenantId: z.number().int(),
      filters: z.object({
        sku: z.string().default(''),
        description: z.string().default(''),
      }),
      page: z.number().int().min(1).default(1),
      perPage: z.number().int().min(1).max(100).default(5),
    }),
  )
    .output(z.custom<StockResponse>())
    .query(async ({ input }) => {
      const payload = await getPayload({ config: configPromise })

      const tenant = await payload.findByID({
        collection: 'tenants',
        id: input.tenantId,
      })

      let url: string
      try {
        url = buildRemoteUrlFromTenant({
          tenant,
          filters: input.filters,
          pagination: { page: input.page, perPage: input.perPage },
        })
      } catch (e) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: e instanceof Error ? e.message : 'Ошибка подготовки URL',
        })
      }

      const response = await fetch(url, {
        next: { revalidate: 60 },
      })

      if (!response.ok) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: `HTTP error! status: ${response.status}`,
        })
      }

      try {
        const data: StockResponse = await response.json()
        return data
      } catch (e) {
        console.error('Error parsing JSON response', e)
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'Error parsing JSON response',
        })
      }
    }),
})
