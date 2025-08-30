import type { Payload } from 'payload'
import fs from 'fs'
import path from 'path'
import { Media } from '@/payload-types' // Убедитесь, что тип импортирован

// Определяем, какие медиафайлы мы хотим иметь в системе
const mediaFiles = [
  {
    key: 'homeHero',
    path: './images/home-hero.webp',
    alt: 'Straight metallic shapes with a blue gradient',
  },
  {
    key: 'pagehero',
    path: './images/page-hero.webp',
    alt: 'Description for post image 1',
  },
  {
    key: 'postHero',
    path: './images/post-hero.webp',
    alt: 'Description for post image 2',
  },
]

// Определяем тип для возвращаемого объекта
type SeedMediaResult = {
  [key: string]: Media
}

export const seedMedia = async (payload: Payload): Promise<SeedMediaResult> => {
  payload.logger.info('--- Заполнение медиафайлами ---')

  const mediaResult: SeedMediaResult = {}

  for (const mediaFile of mediaFiles) {
    const filePath = path.resolve(__dirname, mediaFile.path)
    const fileName = path.basename(filePath)

    // 1. ПРОВЕРЯЕМ, СУЩЕСТВУЕТ ЛИ ФАЙЛ
    const existingMedia = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: fileName,
        },
      },
    })

    if (existingMedia.docs.length > 0) {
      // 2. ЕСЛИ ФАЙЛ НАЙДЕН - ИСПОЛЬЗУЕМ ЕГО
      payload.logger.info(`Медиафайл '${fileName}' уже существует. Используем его.`)
      mediaResult[mediaFile.key] = existingMedia.docs[0] as Media
    } else {
      // 3. ЕСЛИ ФАЙЛ НЕ НАЙДЕН - СОЗДАЕМ ЕГО
      if (fs.existsSync(filePath)) {
        payload.logger.info(`Загружаем медиафайл '${fileName}'...`)
        const createdMedia = await payload.create({
          collection: 'media',
          filePath,
          data: {
            alt: mediaFile.alt,
          },
        })
        mediaResult[mediaFile.key] = createdMedia as Media
      } else {
        payload.logger.error(`Медиафайл по пути ${filePath} не найден. Пропускаем.`)
      }
    }
  }

  payload.logger.info('--- Заполнение медиафайлами завершено ---')
  return mediaResult
}
