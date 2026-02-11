'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { GeneralSearchSchema } from '@/entities/search-request/_domain/schemas'

export async function sendGeneralSearchRequest(formData: unknown) {
  const validated = GeneralSearchSchema.safeParse(formData)
  if (!validated.success) return { error: 'Некорректные данные' }

  const { productName, email, phone, companyName, note } = validated.data
  const payload = await getPayload({ config: configPromise })

  try {
    await payload.create({
      collection: 'search-requests',
      data: { productName, email, phone, companyName, note: note },
    })

    await payload.sendEmail({
      to: 'ruslan.kharisov@gmail.com',
      subject: `🔍 Запрос на поиск: ${productName}`,
      html: `
        <p><b>Ищут:</b> ${productName}</p>
        <p><b>Компания:</b> ${companyName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Детали:</b> ${note || '-'}</p>
      `,
    })

    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: 'Ошибка сервера' }
  }
}
