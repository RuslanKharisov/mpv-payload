import { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'

/**
 * Вспомогательная функция для рекурсивного обновления счетчиков вверх по дереву категорий.
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
        depth: 0, // Нам нужен только parent ID, не тянем всё дерево
      })

      if (!category) break

      await payload.update({
        collection: 'product-categories',
        id: currentId,
        data: {
          // Гарантируем, что счетчик не уйдет в минус
          productCount: Math.max(0, (category.productCount || 0) + delta),
        },
      })

      // Извлекаем ID родителя для следующей итерации (обработка и объекта, и ID)
      currentId = typeof category.parent === 'object' ? category.parent?.id : category.parent
    } catch (error) {
      // Если категория не найдена или ошибка БД, прерываем цикл
      console.error(`[SyncCategory] Error updating category ${currentId}:`, error)
      break
    }
  }
}

/**
 * Хук после изменения/создания товара.
 * Сравнивает старую и новую категории для корректного пересчета.
 */
export const syncCategoryProductCounts: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  // Извлекаем ID категорий (учитываем, что поле может быть объектом или числом)
  const getCategoryId = (cat: any) => (typeof cat === 'object' ? cat?.id : cat)

  const oldCatId = previousDoc ? getCategoryId(previousDoc.productCategory) : null
  const newCatId = getCategoryId(doc.productCategory)

  // Сценарий 1: Категория изменилась у существующего товара
  if (oldCatId !== newCatId) {
    // Вычитаем у старой и всех её родителей
    if (oldCatId) {
      await updateCategoryHierarchy(payload, oldCatId, -1)
    }
    // Прибавляем новой и всем её родителям
    if (newCatId) {
      await updateCategoryHierarchy(payload, newCatId, 1)
    }
  }
}

/**
 * Хук после удаления товара.
 * Уменьшает счетчик у категории удаленного товара.
 */
export const syncCategoryProductCountsOnDelete: CollectionAfterDeleteHook = async ({
  doc,
  req: { payload },
}) => {
  const getCategoryId = (cat: any) => (typeof cat === 'object' ? cat?.id : cat)
  const catId = getCategoryId(doc.productCategory)

  if (catId) {
    await updateCategoryHierarchy(payload, catId, -1)
  }
}
