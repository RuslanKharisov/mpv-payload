import { ApiExternalProcedure, baseProcedure, createTRPCRouter } from '@/shared/trpc/init'
import { TRPCError } from '@trpc/server'
import { headers as getHeaders } from 'next/headers'
import { generateRequestEmail } from '../../email/generateRequestEmail'
import { PriceRequestSchema } from '@/entities/price-request/_domain/schemas'

export const sendPriceRequestRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders()

    const session = await ctx.payload.auth({ headers })

    return session
  }),

  sendPriceRequest: baseProcedure.input(PriceRequestSchema).mutation(async ({ ctx, input }) => {
    try {
      const { formData, items, tenantName, tenantEmail } = input

      const html = await generateRequestEmail({
        tenantName: tenantName,
        tenantEmail: tenantEmail,
        formData,
        items,
      })

      // В ctx.payload.sendEmail у тебя уже есть адаптер на Resend
      await ctx.payload.sendEmail({
        to: tenantEmail,
        subject: `Запрос на КП от ${formData.companyName}`,
        html,
      })

      return { ok: true }
    } catch (err) {
      console.error(err)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Не удалось отправить запрос поставщику',
      })
    }
  }),
})
