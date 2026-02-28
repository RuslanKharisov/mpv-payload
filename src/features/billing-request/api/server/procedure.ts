import { BillingRequestSchema } from '@/entities/billing-request/_domain/schemas'
import { baseProcedure, createTRPCRouter } from '@/shared/trpc/init'
import { TRPCError } from '@trpc/server'
import { generateBillingRequestEmail } from '../../email/generateBillingRequestEmail'

const toEmail = process.env.BILLING_REQUEST_EMAIL

export const billingRequestRouter = createTRPCRouter({
  sendBillingRequest: baseProcedure.input(BillingRequestSchema).mutation(async ({ ctx, input }) => {
    // Check if toEmail is configured before entering try block to avoid catching TRPCError
    if (!toEmail) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Не настроен адрес для заявок на тариф',
      })
    }

    try {
      const { formData, tariffId, tariffName } = input

      // защитимся от ботов (honeypot)
      if (formData.website?.trim()) {
        return { ok: true }
      }

      const html = await generateBillingRequestEmail({
        formData,
        tariffId,
        tariffName,
      })

      await ctx.payload.sendEmail({
        to: toEmail,
        subject: `Запрос на тариф "${tariffName}" от ${formData.companyName}`,
        html,
      })

      return { ok: true }
    } catch (err) {
      console.error(err)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Не удалось отправить запрос на тариф',
      })
    }
  }),
})
