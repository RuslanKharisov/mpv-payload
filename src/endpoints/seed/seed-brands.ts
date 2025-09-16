import type { Payload } from 'payload'
import { brandsData } from './data/brands-data'

export async function seedManufacturers(payload: Payload) {
  for (const manufacturer of brandsData) {
    const existing = await payload.find({
      collection: 'manufacturers',
      where: { name: { equals: manufacturer.name } },
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'manufacturers',
        id: existing.docs[0].id,
        data: {
          ...manufacturer,
          updatedAt: new Date().toISOString(),
        },
      })
      console.log(`✅ Брэнд обновлён: ${manufacturer.name}`)
    } else {
      await payload.create({
        collection: 'manufacturers',
        data: manufacturer,
      })
      console.log(`➕ Брэнд создан: ${manufacturer.name}`)
    }
  }
}
