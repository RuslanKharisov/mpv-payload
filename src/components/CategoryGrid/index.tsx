import { ProductCategory } from '@/payload-types'
import { CategoryGroup } from './_ui/CategoryGroup'

const CategoryGrid = ({ categories }: { categories: ProductCategory[] }) => {
  const categoriesByParent: Record<string, ProductCategory[]> = {}
  const parentCategories: Record<string, ProductCategory> = {}

  categories.forEach((category) => {
    if (category.parent && typeof category.parent === 'object' && category.parent.id) {
      const parentId = category.parent.id.toString()
      if (!categoriesByParent[parentId]) {
        categoriesByParent[parentId] = []
        parentCategories[parentId] = category.parent
      }
      categoriesByParent[parentId].push(category)
    } else if (!category.parent) {
      if (!categoriesByParent[category.id]) {
        categoriesByParent[category.id] = []
        parentCategories[category.id] = category
      }
    }
  })

  return (
    <div className="columns-[300px] gap-x-4 gap-y-[10px]">
      {Object.entries(parentCategories).map(([parentId, parentCategory]) => (
        <CategoryGroup
          key={parentId}
          parentCategory={parentCategory}
          childCategories={categoriesByParent[parentId] || []}
        />
      ))}
    </div>
  )
}

export { CategoryGrid }
