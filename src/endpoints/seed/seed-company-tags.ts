import type { Payload } from 'payload'
import { companyTagsData } from './data/company-tags-data'

export async function seedCompanyTags(payload: Payload) {
  for (const tag of companyTagsData) {
    const existing = await payload.find({
      collection: 'company-tags',
      where: { slug: { equals: tag.slug } },
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'company-tags',
        id: existing.docs[0].id,
        data: {
          ...tag,
          updatedAt: new Date().toISOString(),
        },
      })
      console.log(`✅ Тег обновлён: ${tag.name}`)
    } else {
      await payload.create({
        collection: 'company-tags',
        data: tag,
      })
      console.log(`➕ Тег создан: ${tag.name}`)
    }
  }
}
