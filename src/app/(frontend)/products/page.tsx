// src/app/(frontend)/products/page.tsx
import React, { cache, useState } from 'react'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { Product, ProductCategory } from '@/payload-types'
import { ProductsBlock } from '@/components/ProductsBlock'
import { getPayload } from 'payload'
import { FiltersSidebar } from '@/widgets/filters-sidebar'
import { WithPopulatedMany } from '@/shared/utilities/payload-types-extender'
import { ProductsPagination } from '@/widgets/products-catalog'
import { SearchInput } from '@/widgets/serch-input'

export const revalidate = 60

type ProductCategoryWithParents = WithPopulatedMany<ProductCategory, { parent: ProductCategory }>

type Args = {
  searchParams: Promise<{ [key: string]: string }>
}

export default async function Page({ searchParams: paramsPromice }: Args) {
  const { page, category: categorySlug, phrase } = await paramsPromice
  const pageNumber = Number(page) || 1
  const payload = await getPayload({ config: configPromise })
  const allCategories = await getAllCategories()

  const where: any = {}
  let currentCategory: ProductCategory | undefined

  if (categorySlug) {
    currentCategory = allCategories.find((c) => c.slug === categorySlug)
    if (!currentCategory) return notFound()

    const childrenIds = findAllChildrenIds(
      currentCategory.id,
      allCategories as ProductCategoryWithParents[],
    )
    const allCategoryIds = [String(currentCategory.id), ...childrenIds]

    where['productCategory.id'] = { in: allCategoryIds }
  }

  if (phrase) {
    where.or = [
      {
        name: { contains: phrase }, // Условие 1: Искать в названии
      },
      {
        sku: { contains: phrase }, // Условие 2: Искать в SKU
      },
    ]
  }

  const productsReq = await payload.find({
    collection: 'products',
    where,
    page: pageNumber,
    limit: 12,
    depth: 2,
  })

  // Заголовок страницы
  const pageTitle = currentCategory ? currentCategory.title : 'Каталог оборудования'

  return (
    <div className="py-3 lg:py-16">
      <div className="container">
        <div className=" flex flex-col md:flex-row gap-5 lg:gap-12">
          <FiltersSidebar
            allCategories={allCategories as ProductCategoryWithParents[]}
            activeCategorySlug={categorySlug as string}
          />

          <main className="flex flex-1 flex-col gap-5">
            <div className="prose dark:prose-invert max-w-none">
              <h1>{pageTitle}</h1>
            </div>

            <SearchInput />

            <ProductsBlock products={productsReq.docs as Product[]} />

            {productsReq.totalPages > 1 && productsReq.page && (
              <div className="mt-12">
                <ProductsPagination
                  page={productsReq.page}
                  totalPages={productsReq.totalPages}
                  route="products" // Базовый путь
                  extraParams={{ category: categorySlug, phrase: phrase }} // Передаем фильтры
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

const getAllCategories = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'product-categories',
    depth: 1,
    limit: 1000,
  })

  return result.docs || null
})

const findAllChildrenIds = (
  categoryId: string | number,
  allCategories: ProductCategoryWithParents[],
): string[] => {
  const children = allCategories.filter((cat) => String(cat.parent?.id) === String(categoryId))

  let ids: string[] = []
  for (const child of children as ProductCategory[]) {
    ids.push(String(child.id))
    ids = ids.concat(findAllChildrenIds(child.id, allCategories))
  }

  return ids
}
