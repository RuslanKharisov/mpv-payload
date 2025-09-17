import { ProductCategoryWithParents } from '@/entities/category'

export function getSidebarCategories(
  allCategories: ProductCategoryWithParents[],
  activeCategorySlug?: string,
): {
  title: string
  categories: ProductCategoryWithParents[]
  showAll: boolean
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

  // Определим родителя: если есть parent → берём его, иначе сама категория = родитель
  const parentId =
    typeof activeCategory.parent === 'object'
      ? activeCategory.parent?.id
      : (activeCategory.parent ?? activeCategory.id)

  const parent = allCategories.find((cat) => cat.id === parentId) ?? activeCategory

  // Дети этого родителя
  const children = allCategories.filter((cat) => {
    const parentValue = typeof cat.parent === 'object' ? cat.parent?.id : cat.parent
    return parentValue === parent.id
  })

  return {
    title: parent?.title ?? 'Категории',
    categories: children,
    showAll: true,
  }
}
