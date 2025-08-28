// src/endpoints/seed/seed-media.ts
import type { Payload } from 'payload'
import { image2 } from './data/image-2'
import { imageHero1 } from './data/image-hero-1'
import { fetchFileFromDisk } from '@/utilities/fetchFileFromDisk'

export const seedMedia = async (payload: Payload) => {
  payload.logger.info('Загрузка медиафайлов...')

  const [heroBuffer] = await Promise.all([fetchFileFromDisk('equipment_warehouse.webp')])

  const imageHomeDoc = await payload.create({
    collection: 'media',
    data: imageHero1,
    file: {
      data: heroBuffer,
      mimetype: 'image/webp',
      name: 'equipment_warehouse.webp',
      size: heroBuffer.length,
    },
  })

  payload.logger.info('✓ Медиафайлы успешно загружены.')

  // Возвращаем созданные документы, чтобы использовать их в других сидерах
  return {
    imageHomeDoc,
  }
}
