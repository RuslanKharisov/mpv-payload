// src/endpoints/seed/seed-media.ts
import type { Payload } from 'payload'
import { image2 } from './data/image-2'
import { imageHero1 } from './data/image-hero-1'
import { fetchFileByURL } from '@/utilities/fetchFileByURL'

export const seedMedia = async (payload: Payload) => {
  payload.logger.info('Загрузка медиафайлов...')

  const [image2Buffer, hero1Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const image2Doc = await payload.create({
    collection: 'media',
    data: image2,
    file: image2Buffer,
  })

  const imageHomeDoc = await payload.create({
    collection: 'media',
    data: imageHero1,
    file: hero1Buffer,
  })

  payload.logger.info('✓ Медиафайлы успешно загружены.')

  // Возвращаем созданные документы, чтобы использовать их в других сидерах
  return {
    image2Doc,
    imageHomeDoc,
  }
}
