import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './data/contact-form'
import { contact as contactPageData } from './data/contact-page'

import { seedMedia } from './seed-media'
import { seedHomePage } from './seed-home-page'
import { seedPostCategories } from './seed-post-categories'
import { seedUsers } from './seed-users'
import { seedPosts } from './seed-posts'

/* --- СПИСКИ КОЛЛЕКЦИЙ И ГЛОБАЛЬНЫХ НАСТРОЕК ДЛЯ ОЧИСТКИ --- */
const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
  'product-categories',
]
const globals: GlobalSlug[] = ['header', 'footer']

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Запущен скрипт seed базы данных...')

  /* --- ОЧИСТКА ДАННЫХ --- */

  // Этот блок очищает все указанные коллекции и глобальные настройки.
  // Полезно включать, если нужно начать с чистого листа.
  /*
  payload.logger.info(`— Clearing collections and globals...`)


  /* Очистка коллекций из массива collections */
  /*    
  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )
  */

  /* Очистка версий документов */
  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  /* --- Загрузка медиафайлов --- */
  const media = await seedMedia(payload)
  const users = await seedUsers(payload)

  /* --- Создание категорий --- */
  await seedPostCategories({ payload, req })

  /* --- Создание постов  --- */
  await seedPosts(payload, req, { media, users })

  /* --- Создание главной страницы --- */
  await seedHomePage(payload, media)
}
