import { ProductCategoryWithParents } from '@/entities/category'

export function getSidebarCategories(
  allCategories: ProductCategoryWithParents[],
  activeCategorySlug?: string,
): {
  title: string
  categories: ProductCategoryWithParents[]
  showAll?: boolean
} {
  if (!activeCategorySlug) {
    const rootCategories = allCategories.filter((cat) => !cat.parent)
    return {
      title: 'Все категории',
      categories: rootCategories,
      showAll: false,
    }
  }

  const activeCategory = allCategories.find((cat) => cat.slug === activeCategorySlug)
  if (!activeCategory) {
    return { title: 'Все категории', categories: [], showAll: true }
  }

  const children = allCategories.filter((cat) => {
    const parentValue = typeof cat.parent === 'object' ? cat.parent?.id : cat.parent
    return parentValue === activeCategory.id
  })

  if (children.length > 0) {
    return {
      title: activeCategory.title,
      categories: children,
      showAll: true,
    }
  }

  const parentId =
    typeof activeCategory.parent === 'object' ? activeCategory.parent?.id : activeCategory.parent

  const siblings = allCategories.filter((cat) => {
    const parentValue = typeof cat.parent === 'object' ? cat.parent?.id : cat.parent
    return parentValue === parentId
  })

  return {
    title: activeCategory.title,
    categories: siblings,
    showAll: true,
  }
}
