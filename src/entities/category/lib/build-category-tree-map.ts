import { ProductCategory } from '@/payload-types'

/**
 * Строит мапу: parentId -> массив дочерних ID.
 * Корневые категории (у которых parent = null) игнорируются как ключи,
 * но их ID могут быть в значениях, если у них есть дети.
 */
export const buildCategoryTreeMap = (
  categories: Pick<ProductCategory, 'id' | 'parent'>[],
): Record<number, number[]> => {
  const tree: Record<number, number[]> = {}

  for (const cat of categories) {
    const parentId = typeof cat.parent === 'object' ? cat.parent?.id : cat.parent // cat.parent — либо число, либо null

    if (typeof parentId === 'number') {
      if (!tree[parentId]) {
        tree[parentId] = []
      }
      tree[parentId].push(cat.id)
    }
    // Если parentId === null — категория корневая, её не добавляем как ребёнка
  }

  return tree
}
