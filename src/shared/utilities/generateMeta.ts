import type { Metadata } from 'next'
import type { Page, Post, SiteSetting, Media, Config } from '@/payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

// Функция для получения URL изображения (остается без изменений)
const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null): string | undefined => {
  if (!image) return undefined
  const serverUrl = getServerSideURL()
  if (typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    return ogUrl ? `${serverUrl}${ogUrl}` : `${serverUrl}${image.url}`
  }
  return undefined
}

// Тип для документа делаем максимально гибким
// Это позволяет нам работать с любым объектом, который имеет поля 'title' или 'name'
type Doc = Partial<Page> | Partial<Post> | { [key: string]: any }

type GenerateMetaArgs = {
  doc?: Doc | null
  globals?: Partial<SiteSetting> | null
}

export const generateMeta = (args: GenerateMetaArgs = {}): Metadata => {
  const { doc, globals } = args

  // 1. Определяем источник SEO-данных из плагина
  const seoFromPayload = doc?.meta || globals?.meta

  // ✅ 2. ОПРЕДЕЛЯЕМ ЗАГОЛОВОК С УЧЕТОМ 'TITLE' И 'NAME'
  // Мы пытаемся найти заголовок в следующем порядке:
  // 1. SEO-поле Title, явно заданное в админке
  // 2. Поле 'title' самого документа (например, для Page или Post)
  // 3. Поле 'name' самого документа (например, для Product или Category)
  // 4. Заголовок по умолчанию

  let docTitle = ''
  if (doc) {
    if ('title' in doc && typeof doc.title === 'string') {
      docTitle = doc.title
    } else if ('name' in doc && typeof doc.name === 'string') {
      docTitle = doc.name
    }
  }

  const title =
    seoFromPayload?.title || // 1. SEO Title
    docTitle || // 2. Title или Name документа
    'Онлайн склад | Prom-Stock' // 3. Глобальный fallback

  // 3. Определяем описание
  const description =
    seoFromPayload?.description ||
    globals?.meta?.description ||
    'Широкий ассортимент промышленного оборудования, запчастей и расходников Prom-Stock.'

  // 4. Определяем изображение
  const ogImage = getImageURL(seoFromPayload?.image || globals?.meta?.image)

  // 5. Формируем канонический URL
  const canonicalUrl = doc?.slug ? `${getServerSideURL()}/${doc.slug}` : getServerSideURL()

  // 6. Собираем и возвращаем объект Metadata
  return {
    metadataBase: new URL(getServerSideURL()),
    title,
    description,
    openGraph: mergeOpenGraph({
      title,
      description,
      url: canonicalUrl,
      images: ogImage ? [{ url: ogImage }] : undefined,
    }),
    twitter: {
      card: 'summary_large_image',
      creator: '@payloadcms',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}
