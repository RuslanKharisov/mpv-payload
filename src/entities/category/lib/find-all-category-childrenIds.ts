import { ProductCategory } from '@/payload-types'
import { ProductCategoryWithParents } from '..'

const findAllCategoryChildrenIds = (
  categoryId: string | number,
  allCategories: ProductCategoryWithParents[],
): string[] => {
  const children = allCategories.filter((cat) => String(cat.parent?.id) === String(categoryId))

  let ids: string[] = []
  for (const child of children as ProductCategory[]) {
    ids.push(String(child.id))
    ids = ids.concat(findAllCategoryChildrenIds(child.id, allCategories))
  }

  return ids
}

export { findAllCategoryChildrenIds }
