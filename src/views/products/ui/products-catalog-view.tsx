'use client'

import { Brand, Product, ProductCategory } from '@/payload-types'
import { FiltersSidebar } from '@/widgets/filters-sidebar'
import { SearchInput } from '@/widgets/serch-input'
import { ProductsBlock } from '@/components/ProductsBlock'
import { ProductsPagination } from '@/widgets/products-catalog'
import { ProductCategoryWithParents } from '@/entities/category'

type Props = {
  products?: Product[]
  pagination: {
    page: number
    totalPages: number
  }
  currentCategory?: ProductCategory
  allCategories: ProductCategoryWithParents[]
  brands?: Brand[]
  activeCategorySlug?: string
  phrase?: string
  selectedBrands?: string[]
}

export function ProductsCatalogView({
  products,
  pagination,
  currentCategory,
  allCategories,
  brands,
  activeCategorySlug,
  phrase,
  selectedBrands,
}: Props) {
  const pageTitle = currentCategory ? currentCategory.title : 'Каталог оборудования'

  return (
    <div className="py-3 lg:py-16">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-5 lg:gap-12">
          <FiltersSidebar
            allCategories={allCategories}
            activeCategorySlug={activeCategorySlug ?? ''}
            brands={brands}
            selectedBrands={selectedBrands}
          />

          <main className="flex flex-1 flex-col gap-5">
            <div className="prose dark:prose-invert max-w-none">
              <h1>{pageTitle}</h1>
            </div>

            <SearchInput />

            <ProductsBlock products={products} />

            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <ProductsPagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  route="products"
                  extraParams={{ category: activeCategorySlug, phrase }}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
