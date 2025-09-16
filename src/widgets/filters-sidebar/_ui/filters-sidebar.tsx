'use client'

import Link from 'next/link'
import { ProductCategory } from '@/payload-types'
import { getSidebarCategories } from '@/features/get-sidebar-categories'
import { WithPopulatedMany } from '@/shared/utilities/payload-types-extender'

type CategoryWithParent = WithPopulatedMany<ProductCategory, { parent: ProductCategory }>

export function FiltersSidebar({
  allCategories,
  activeCategorySlug,
}: {
  allCategories: CategoryWithParent[]
  activeCategorySlug?: string
}) {
  const { title, categories, showAll } = getSidebarCategories(allCategories, activeCategorySlug)

  return (
    <aside className="p-4 w-64 bg-gray-50">
      {showAll && (
        <div>
          Назад:
          <Link href="/products" className="block mb-3 font-medium text-ring text-lg">
            Все категории
          </Link>
        </div>
      )}
      <h3 className="mb-1 font-bold text-lg">{title}</h3>
      <ul className="space-y-1">
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link href={`/products?category=${cat.slug}`} className="hover:text-ring text-sm">
              {cat.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
