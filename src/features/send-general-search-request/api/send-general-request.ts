'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import {
  GeneralSearchRequestValues,
  GeneralSearchSchema,
} from '@/entities/search-request/_domain/schemas'

export async function sendGeneralSearchRequest(formData: GeneralSearchRequestValues) {
  const validated = GeneralSearchSchema.safeParse(formData)
  if (!validated.success) return { error: 'Некорректные данные' }

  if (formData.website && formData.website.length > 0) {
    console.warn('Bot detected via honeypot')
    return { success: true }
  }

  const { productName, email, phone, companyName, note } = validated.data

  const payload = await getPayload({ config: configPromise })

  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  const notifyEmail = process.env.SEARCH_REQUEST_NOTIFY_EMAIL
  if (!notifyEmail) throw new Error('SEARCH_REQUEST_NOTIFY_EMAIL is not configured')

  try {
    await payload.sendEmail({
      to: notifyEmail,
      subject: `🔍 Запрос на поиск: ${productName}`,
      html: `
        <p><b>Ищут:</b> ${escapeHtml(productName)}</p>
       <p><b>Компания:</b> ${escapeHtml(companyName)}</p>
       <p><b>Email:</b> ${escapeHtml(email)}</p>
       <p><b>Детали:</b> ${escapeHtml(note || '-')}</p>
      `,
    })
  } catch (err) {
    console.error('Failed to send notification email:', err)
  }

  return { success: true }
}
