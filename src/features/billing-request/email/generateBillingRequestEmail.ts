import { BillingRequestSchema } from '@/entities/billing-request/_domain/schemas'
import { generateEmailHTML } from '@/payload/email/generateEmailHTML'
import { sanitizeEmail } from '@/shared/utilities/sanitazeData'
import { sanitizeUserDataForEmail } from 'payload/shared'
import z from 'zod'

type Args = z.infer<typeof BillingRequestSchema>

export const generateBillingRequestEmail = async (args: Args): Promise<string> => {
  const { formData, tariffId, tariffName } = args

  return generateEmailHTML({
    headline: 'Новый запрос на тариф',
    content: `
    <h2 style="margin-bottom: 12px;">Запрос тарифа</h2>
    <table cellpadding="4" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 4px 8px; color: #555;">Тариф:</td>
        <td style="padding: 4px 8px; font-weight: 600;">
          ${sanitizeUserDataForEmail(tariffName)}
        </td>
      </tr>
      <tr>
        <td style="padding: 4px 8px; color: #555;">ID тарифа:</td>
        <td style="padding: 4px 8px;">${String(tariffId)}</td
      </tr>
    </table>

    <h2 style="margin-bottom: 12px;">Данные клиента</h2>
    <table cellpadding="4" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 4px 8px; color: #555;">Компания:</td>
        <td style="padding: 4px 8px; font-weight: 500;">
          ${sanitizeUserDataForEmail(formData.companyName)}
        </td>
      </tr>
      <tr>
        <td style="padding: 4px 8px; color: #555;">Email:</td>
        <td style="padding: 4px 8px;">
          <a href="mailto:${sanitizeEmail(formData.email)}">
            ${sanitizeEmail(formData.email)}
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding: 4px 8px; color: #555;">Телефон:</td>
        <td style="padding: 4px 8px;">
          ${sanitizeUserDataForEmail(formData.phone || '—')}
        </td>
      </tr>
    </table>

    <h3 style="margin-bottom: 8px;">Комментарий</h3>
    <p style="padding: 8px 10px; background-color: #f7f7f7; border-radius: 4px;">
      ${sanitizeUserDataForEmail(formData.note || '—')}
    </p>

    <hr style="margin-top: 24px; border: none; border-top: 1px solid #e0e0e0;" />
  `,
  })
}
