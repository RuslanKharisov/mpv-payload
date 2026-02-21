import type { Product } from '@/payload-types'
import type { Payload } from 'payload'

export const afterReadHook = async ({
  doc,
  req: { payload },
}: {
  doc: Product
  req: { payload: Payload }
}) => {
  if (doc.productImage) {
    return doc
  }

  // Если картинки нет, получаем заглушку из глобальных настроек
  try {
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })

    if (siteSettings.productPlaceholder) {
      return {
        ...doc,
        productImage: siteSettings.productPlaceholder,
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(`Error fetching site-settings for placeholder: ${errorMessage}`)
  }

  return doc
}
