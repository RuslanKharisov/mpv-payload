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
    // Ничего не выбрано → показываем только родителей
    const rootCategories = allCategories.filter((cat) => !cat.parent)
    return {
      title: 'Все категории',
      categories: rootCategories,
      showAll: false,
    }
  }

  // Найдём активную категорию по slug
  const activeCategory = allCategories.find((cat) => cat.slug === activeCategorySlug)
  if (!activeCategory) {
    return { title: 'Все категории', categories: [], showAll: true }
  }

  // Показываем дочерние категории активной категории
  const children = allCategories.filter((cat) => {
    const parentValue = typeof cat.parent === 'object' ? cat.parent?.id : cat.parent
    return parentValue === activeCategory.id
  })

  // Если есть дочерние категории, показываем их
  if (children.length > 0) {
    return {
      title: activeCategory.title,
      categories: children,
      showAll: true,
    }
  }

  // Если нет дочерних категорий, показываем категории того же уровня (с тем же родителем)
  const parentId =
    typeof activeCategory.parent === 'object'
      ? activeCategory.parent?.id
      : (activeCategory.parent ?? activeCategory.id)

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
