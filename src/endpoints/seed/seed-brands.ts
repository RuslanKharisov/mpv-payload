import type { Payload } from 'payload'
import { brandsData } from './data/brands-data'

export async function seedBrands(payload: Payload) {
  for (const brand of brandsData) {
    const existing = await payload.find({
      collection: 'brands',
      where: { name: { equals: brand.name } },
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'brands',
        id: existing.docs[0].id,
        data: {
          ...brand,
          updatedAt: new Date().toISOString(),
        },
      })
      console.log(`✅ Брэнд обновлён: ${brand.name}`)
    } else {
      await payload.create({
        collection: 'brands',
        data: brand,
      })
      console.log(`➕ Брэнд создан: ${brand.name}`)
    }
  }
}
