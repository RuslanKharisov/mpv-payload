import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './data/contact-form'
import { contact as contactPageData } from './data/contact-page'

import { seedMedia } from './seed-media'
import { seedPostCategories } from './seed-post-categories'
import { seedUsers } from './seed-users'
import { seedPosts } from './seed-posts'
import { seedPolicyPage } from './seed-policy-page'
import { seedPages } from './seed-pages'
import { seedProducts } from './seed-products'

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
  console.log('Запущен скрипт seed базы данных...')

  /* --- ОЧИСТКА ДАННЫХ --- */

  // Этот блок очищает все указанные коллекции и глобальные настройки.
  // Полезно включать, если нужно начать с чистого листа.
  /*
  console.log(`— Clearing collections and globals...`)


  /* Очистка коллекций из массива collections */
  /*    
  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )
  */

  // await payload.db.deleteMany({
  //   collection: 'media',
  //   req,
  //   where: {},
  // })

  /* Очистка версий документов */
  // await Promise.all(
  //   collections
  //     .filter((collection) => Boolean(payload.collections[collection].config.versions))
  //     .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  // )

  /* --- Загрузка медиафайлов --- */

  // const media = await seedMedia(payload)
  // const users = await seedUsers(payload)

  /* --- Создание категорий --- */
  // await seedPostCategories({ payload, req })

  /* --- Создание постов  --- */
  // await seedPosts(payload, req, { media, users })

  const shouldSeedPages = ['--home', '--policy', '--terms', '--agreement', '--guide']

  /* --- Создание главной страницы --- */
  // await seedPages(payload, media, shouldSeedPages)

  // await seedProducts(payload)

  /* --- Создание страницы политики --- */
  // await seedPolicyPage(payload, media)
}
