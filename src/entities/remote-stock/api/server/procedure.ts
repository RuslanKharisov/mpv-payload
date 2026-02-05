import { ApiExternalProcedure, createTRPCRouter } from '@/shared/trpc/init'
import { TRPCError } from '@trpc/server'
import z from 'zod'
import { StockResponse } from '../../_domain/tstock-response'

export const remoteStocksRouter = createTRPCRouter({
  getByUrl: ApiExternalProcedure.input(z.object({ url: z.string() }))
    .output(z.custom<StockResponse>()) // Добавляем типизацию ответа
    .query(async ({ input }) => {
      const response = await fetch(input.url.toString(), {
        next: { revalidate: 60 * 1 }, // кэш на 60 минут
      })

      if (!response.ok) {
        throw new TRPCError({
          message: `HTTP error! status: ${response.status}`,
          code: 'BAD_GATEWAY',
        })
      }

      try {
        const data: StockResponse = await response.json()
        return data
      } catch (e) {
        console.error('Error parsing JSON response', e)
        throw new TRPCError({
          message: 'Error parsing JSON response',
          code: 'PARSE_ERROR',
        })
      }
    }),
})
