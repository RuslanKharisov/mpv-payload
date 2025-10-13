import type { Metadata } from 'next'
import type { Page, Post, SiteSetting, Media, Config } from '@/payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null): string | undefined => {
  if (!image) return undefined
  const serverUrl = getServerSideURL()
  if (typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    return ogUrl ? `${serverUrl}${ogUrl}` : `${serverUrl}${image.url}`
  }
  return undefined
}

type Doc = Partial<Page> | Partial<Post> | { [key: string]: any }

type GenerateMetaArgs = {
  doc?: Doc | null
  globals?: Partial<SiteSetting> | null
}

export const generateMeta = (args: GenerateMetaArgs = {}): Metadata => {
  const { doc, globals } = args

  const seoFromPayload = doc?.meta || globals?.meta

  let docTitle = ''
  if (doc) {
    if ('title' in doc && typeof doc.title === 'string') {
      docTitle = doc.title
    } else if ('name' in doc && typeof doc.name === 'string') {
      docTitle = doc.name
    }
  }

  const title = seoFromPayload?.title || docTitle || 'Онлайн склад | Prom-Stock'

  const description =
    seoFromPayload?.description ||
    globals?.meta?.description ||
    'Широкий ассортимент промышленного оборудования, запчастей и расходников Prom-Stock.'

  const ogImage = getImageURL(seoFromPayload?.image || globals?.meta?.image)

  const canonicalUrl = doc?.slug ? `${getServerSideURL()}/${doc.slug}` : getServerSideURL()

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
