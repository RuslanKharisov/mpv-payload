'use client'

import Link from 'next/link'
import { ProductCategory } from '@/payload-types'
import { getSidebarCategories } from '@/features/get-sidebar-categories'
import { WithPopulatedMany } from '@/shared/utilities/payload-types-extender'
import { useState } from 'react'
import { cn } from '@/shared/utilities/ui'
import { SlidersHorizontal, XIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

type CategoryWithParent = WithPopulatedMany<ProductCategory, { parent: ProductCategory }>

export function FiltersSidebar({
  allCategories,
  activeCategorySlug,
}: {
  allCategories: CategoryWithParent[]
  activeCategorySlug?: string
}) {
  const { title, categories, showAll } = getSidebarCategories(allCategories, activeCategorySlug)
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  console.log('activeCategorySlug ==> ', activeCategorySlug)

  return (
    <>
      <button
        className="z-50 w-full p-2 md:hidden flex justify-end "
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Меню"
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <SlidersHorizontal className="h-6 w-6" />}
      </button>
      <div
        className={cn(
          'z-40 bg-background -translate-x-[200%] absolute left-0 h-full w-full min-w-[fit-content] md:max-w-[324px] space-y-4 md:relative md:translate-x-0 md:min-w-[270px] undefined duration-300',
          isOpen ? 'translate-x-0 w-full' : '-translate-x-full',
        )}
      >
        <div className={cn('p-4 max-w-full bg-card')}>
          {showAll && (
            <div>
              Назад:
              <Link href="/products" className="block mb-3 font-medium text-ring text-lg">
                Все категории
              </Link>
            </div>
          )}
          <h3 className="mb-1 font-bold text-lg text-wrap">{title}</h3>
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className={cn(
                    'hover:text-destructive text-sm',
                    activeCategorySlug === cat.slug ? 'text-destructive' : '',
                  )}
                >
                  {cat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
