import { ApiExternalProcedure, createTRPCRouter } from '@/shared/trpc/init'
import { TRPCError } from '@trpc/server'
import z from 'zod'

export const remoteStocksRouter = createTRPCRouter({
  getByUrl: ApiExternalProcedure.input(z.object({ url: z.string() })).query(async ({ input }) => {
    const response = await fetch(`${input.url.toString()}`)

    if (!response.ok) {
      throw new TRPCError({
        message: `HTTP error! Message: ${response.json()}`,
        code: 'BAD_GATEWAY',
      })
    }

    try {
      return await response.json()
    } catch (e) {
      console.error('Error parsing JSON response', e)
      throw new Error('Error parsing JSON response')
    }
  }),
})
