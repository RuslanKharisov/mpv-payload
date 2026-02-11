import { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'

const getID = (field: unknown): string | number | null =>
  typeof field === 'object' && field !== null
    ? (field as { id: string | number }).id
    : (field as string | number | null)

/**
 * Вспомогательная функция для обновления счетчика бренда
 */
export const updateBrandCount = async (
  payload: Payload,
  brandId: number | string,
  delta: number,
) => {
  try {
    const brand = await payload.findByID({
      collection: 'brands',
      id: brandId,
      depth: 0,
    })
    if (!brand) return

    await payload.update({
      collection: 'brands',
      id: brandId,
      data: {
        productCount: Math.max(0, (brand.productCount || 0) + delta),
      },
    })
  } catch (error) {
    console.error(`[SyncStats] Error updating brand ${brandId}:`, error)
  }
}

/**
 * Ваша существующая функция для категорий (рекурсивная)
 */
export const updateCategoryHierarchy = async (
  payload: Payload,
  categoryId: number | string | null | undefined,
  delta: number,
) => {
  let currentId = categoryId
  while (currentId) {
    try {
      const category = await payload.findByID({
        collection: 'product-categories',
        id: currentId,
        depth: 0,
      })
      if (!category) break

      await payload.update({
        collection: 'product-categories',
        id: currentId,
        data: {
          productCount: Math.max(0, (category.productCount || 0) + delta),
        },
      })
      currentId = typeof category.parent === 'object' ? category.parent?.id : category.parent
    } catch (error) {
      console.error(`[SyncStats] Error updating category ${currentId}:`, error)
      break
    }
  }
}

/**
 * ГЛАВНЫЙ ХУК: Синхронизация при изменении товара
 */
export const syncProductStats: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  // 1. СИНХРОНИЗАЦИЯ КАТЕГОРИЙ
  const oldCatId = previousDoc ? getID(previousDoc.productCategory) : null
  const newCatId = getID(doc.productCategory)

  if (oldCatId !== newCatId) {
    if (oldCatId) await updateCategoryHierarchy(payload, oldCatId, -1)
    if (newCatId) await updateCategoryHierarchy(payload, newCatId, 1)
  }

  // 2. СИНХРОНИЗАЦИЯ БРЕНДОВ
  const oldBrandId = previousDoc ? getID(previousDoc.brand) : null
  const newBrandId = getID(doc.brand)

  if (oldBrandId !== newBrandId) {
    if (oldBrandId) await updateBrandCount(payload, oldBrandId, -1)
    if (newBrandId) await updateBrandCount(payload, newBrandId, 1)
  }
}

/**
 * ХУК ПРИ УДАЛЕНИИ
 */
export const syncProductStatsOnDelete: CollectionAfterDeleteHook = async ({
  doc,
  req: { payload },
}) => {
  const catId = getID(doc.productCategory)
  const brandId = getID(doc.brand)

  if (catId) await updateCategoryHierarchy(payload, catId, -1)
  if (brandId) await updateBrandCount(payload, brandId, -1)
}
