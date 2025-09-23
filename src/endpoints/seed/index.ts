import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './data/contact-form'
import { contact as contactPageData } from './data/contact-page'

import { seedMedia } from './seed-media'
import { seedPostCategories } from './seed-post-categories'
import { seedUsers } from './seed-users'
import { seedPosts } from './seed-posts'
import { seedPages } from './seed-pages'
import { seedGlobal } from './seed-global'
import { seedProductCategories } from './seed-product-categories'
import { seedTariffs } from './seed-tariffs'
import { seedBrands } from './seed-brands'

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

  /* --- Очистка версий документов --- */
  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  /* --- Загрузка медиафайлов --- */

  /** 1. Загрузка медиа для возможности использования при сиде страниц */
  const media = await seedMedia(payload)

  /**  --- Создание главной и страниц политики и соглашений --- */
  const shouldSeedPages = ['--home', '--policy', '--terms', '--agreement', '--guide']
  await seedPages(payload, media, shouldSeedPages)

  /** --- Создание пунков навигации меню --- */
  // await seedGlobal(payload)

  /** --- Создание стартового списка производителей ---  */
  // await seedBrands(payload)

  /** ---  Создание катекорий проукции  --- */
  // await seedProductCategories({ payload, req })

  // await seedTariffs(payload)
}
