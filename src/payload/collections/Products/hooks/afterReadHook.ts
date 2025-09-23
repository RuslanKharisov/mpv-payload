export const afterReadHook = async ({ doc, req: { payload } }: { doc: any; req: any }) => {
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
  } catch (error) {
    payload.logger.error(`Error fetching site-settings for placeholder: ${error}`)
  }

  return doc
}
