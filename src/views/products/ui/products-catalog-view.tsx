'use client'

import { Brand, Product, ProductCategory } from '@/payload-types'
import { FiltersSidebar } from '@/widgets/filters-sidebar'
import { SearchInput } from '@/widgets/serch-input'
import { ProductsBlock } from '@/components/ProductsBlock'
import { ProductsPagination } from '@/widgets/products-catalog'
import { ProductCategoryWithParents } from '@/entities/category'
import { Suspense } from 'react'

type Props = {
  products?: Product[]
  pagination: {
    page: number
    totalPages: number
  }
  currentCategory?: ProductCategory
  allCategories: ProductCategoryWithParents[]
  brands?: Brand[]
  regions?: string[]
  cities?: string[]
  activeCategorySlug?: string
  phrase?: string
  condition?: string
  city?: string
  region?: string
}

export function ProductsCatalogView({
  products,
  pagination,
  currentCategory,
  allCategories,
  brands,
  regions,
  cities,
  activeCategorySlug,
  phrase,
  condition,
  city,
  region,
}: Props) {
  const pageTitle = currentCategory ? currentCategory.title : 'Каталог оборудования'
  return (
    <div className="py-3 lg:py-16">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-5 lg:gap-12">
          <FiltersSidebar
            pageTitle={pageTitle}
            allCategories={allCategories}
            brands={brands}
            regions={regions}
            cities={cities}
          />

          <main className="flex flex-1 flex-col gap-5">
            <div className="prose dark:prose-invert max-w-none">
              <h1>{pageTitle}</h1>
            </div>

            <Suspense>
              <SearchInput currentPhrase={phrase} />
            </Suspense>

            <ProductsBlock products={products} />

            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <ProductsPagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  route="products"
                  extraParams={{ category: activeCategorySlug, phrase, condition, city, region }}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
