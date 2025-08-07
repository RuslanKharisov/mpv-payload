import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'

// --- СПИСКИ КОЛЛЕКЦИЙ И ГЛОБАЛЬНЫХ НАСТРОЕК ДЛЯ ОЧИСТКИ ---
const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
]
const globals: GlobalSlug[] = ['header', 'footer']

// Основная функция для наполнения базы данных (seed)
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // --- ЭТАП 1: ОЧИСТКА ДАННЫХ (ЗАКОММЕНТИРОВАНО) ---
  // Этот блок очищает все указанные коллекции и глобальные настройки.
  // Полезно включать, если нужно начать с чистого листа.
  /*
  payload.logger.info(`— Clearing collections and globals...`)

  // Очистка глобальных настроек
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {
          navItems: [],
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  // Очистка коллекций
  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  // Очистка версий документов
  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )
  */

  // --- ЭТАП 2: СОЗДАНИЕ ДЕМО-ПОЛЬЗОВАТЕЛЯ (ЗАКОММЕНТИРОВАНО) ---
  /*
  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  const demoAuthor = await payload.create({
    collection: 'users',
    data: {
      name: 'Demo Author',
      email: 'demo-author@example.com',
      password: 'password',
    },
  })
  */

  // --- ЭТАП 3: ЗАГРУЗКА И СОЗДАНИЕ МЕДИАФАЙЛОВ ---
  // Оставлены только те изображения, которые используются на главной странице.
  payload.logger.info(`— Seeding media for the Home page...`)

  // Загружаем файлы по URL
  const [image2Buffer, hero1Buffer] = await Promise.all([
    // fetchFileByURL(
    //   'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
    // ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    // fetchFileByURL(
    //   'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post3.webp',
    // ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  // Создаем документы в коллекции 'media'
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

  // --- ЭТАП 4: СОЗДАНИЕ КАТЕГОРИЙ (ЗАКОММЕНТИРОВАНО) ---
  /*
  payload.logger.info(`— Seeding categories...`)
  await Promise.all([
    payload.create({
      collection: 'categories',
      data: { title: 'Technology' },
    }),
    payload.create({
      collection: 'categories',
      data: { title: 'News' },
    }),
    payload.create({
      collection: 'categories',
      data: { title: 'Finance' },
    }),
  ])
  */

  // --- ЭТАП 5: СОЗДАНИЕ ПОСТОВ (ЗАКОММЕНТИРОВАНО) ---
  /*
  payload.logger.info(`— Seeding posts...`)
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })
  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })
  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: { relatedPosts: [post2Doc.id, post3Doc.id] },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: { relatedPosts: [post1Doc.id, post3Doc.id] },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: { relatedPosts: [post1Doc.id, post2Doc.id] },
  })
  */

  // --- ЭТАП 6: СОЗДАНИЕ ФОРМ (ЗАКОММЕНТИРОВАНО) ---
  /*
  payload.logger.info(`— Seeding contact form...`)
  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })
  */

  // --- ЭТАП 7: СОЗДАНИЕ СТРАНИЦ ---
  // Создаем только главную страницу.
  payload.logger.info(`— Seeding pages...`)

  await payload.create({
    collection: 'pages',
    depth: 0,
    data: home({ heroImage: imageHomeDoc, metaImage: image2Doc }),
  })

  // --- ЭТАП 8: СОЗДАНИЕ ДРУГИХ СТРАНИЦ (ЗАКОММЕНТИРОВАНО) ---
  /*
  const contactPage = await payload.create({
    collection: 'pages',
    depth: 0,
    data: contactPageData({ contactForm: contactForm }),
  })
  */

  // --- ЭТАП 9: НАПОЛНЕНИЕ ГЛОБАЛЬНЫХ ДАННЫХ (ЗАКОММЕНТИРОВАНО) ---
  /*
  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          { link: { type: 'custom', label: 'Posts', url: '/posts' } },
          { link: { type: 'reference', label: 'Contact', reference: { relationTo: 'pages', value: contactPage.id } } },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [
          { link: { type: 'custom', label: 'Admin', url: '/admin' } },
          { link: { type: 'custom', label: 'Source Code', newTab: true, url: 'https://github.com/payloadcms/payload/tree/main/templates/website' } },
          { link: { type: 'custom', label: 'Payload', newTab: true, url: 'https://payloadcms.com/' } },
        ],
      },
    }),
  ])
  */

  payload.logger.info('Seeded database successfully!')
}

// Вспомогательная функция для загрузки файла по URL
async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
