import { PriceRequestSchema } from '@/entities/price-request'
import { generateEmailHTML } from '@/payload/email/generateEmailHTML'
import { sanitizeEmail, sanitizePhone } from '@/shared/utilities/sanitazeData'
import { sanitizeUserDataForEmail } from 'payload/shared'
import z from 'zod'
import { formatDeliveryTime } from '../_domain/deliveryTime'

type GenerateRequestEmailArgs = z.infer<typeof PriceRequestSchema>

export const generateRequestEmail = async (args: GenerateRequestEmailArgs): Promise<string> => {
  const { formData, tenantName, items } = args

  return generateEmailHTML({
    headline: 'Новый запрос на коммерческое предложение',
    content: `
      <h2>Данные клиента</h2>
      <p><b>Компания:</b> ${sanitizeUserDataForEmail(formData.companyName)}</p>

      <p><b>Контакт:</b> 
        ${sanitizeUserDataForEmail(formData.firstName)} 
        ${sanitizeUserDataForEmail(formData.lastName)} 
      </p>

      <p><b>Телефон:</b> 
        <a href="tel:${sanitizePhone(formData.phone)}">
          ${sanitizePhone(formData.phone)}
        </a>
      </p>

      <p><b>Email:</b> 
        <a href="mailto:${sanitizeEmail(formData.email)}">
          ${sanitizeEmail(formData.email)}
        </a>
      </p>
      
      <p><b>Желаемый срок поставки:</b> ${formatDeliveryTime(formData.deliveryTime)}</p>
      <p><b>Комментарий:</b> ${sanitizeUserDataForEmail(formData.note || '—')}</p>

      <h3>Список товаров</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th align="left">Код</th>
            <th align="left">Описание</th>
            <th align="center">Количество</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (i) => `
              <tr>
                <td>${sanitizeUserDataForEmail(i.item.sku)}</td>
                <td>${sanitizeUserDataForEmail(i.item.description)}</td>
                <td align="center">${i.quantity}</td>
              </tr>`,
            )
            .join('')}
        </tbody>
      </table>

      <hr />
    `,
  })
}
