import type { Payload } from 'payload'
import { tariffsData } from './data/tariffs-data'

export async function seedTariffs(payload: Payload) {
  for (const tariff of tariffsData) {
    const existing = await payload.find({
      collection: 'tariffs',
      where: { name: { equals: tariff.name } },
    })

    if (existing.docs.length > 0) {
      // обновляем, если найден
      await payload.update({
        collection: 'tariffs',
        id: existing.docs[0].id, // id записи в Payload
        data: {
          ...tariff,
          updatedAt: new Date().toISOString(),
        },
      })
      console.log(`✅ Тариф обновлён: ${tariff.name}`)
    } else {
      // создаём, если нет
      await payload.create({
        collection: 'tariffs',
        data: tariff,
      })
      console.log(`➕ Тариф создан: ${tariff.name}`)
    }
  }
}
