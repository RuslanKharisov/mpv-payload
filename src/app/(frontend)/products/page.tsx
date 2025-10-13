import React from 'react'
import { notFound } from 'next/navigation'
import { getAllCategoriesWithParents } from '@/entities/category/api/get-all-categories'
import { getProducts } from '@/entities/products'
import { ProductsCatalogView } from '@/views/products/ui/products-catalog-view'
import getBrands from '@/entities/brands/api/get-brands'
import { getCategoryBySlug } from '@/entities/category/api/get-category-by-slug'
import { generateMeta } from '@/shared/utilities/generateMeta'
import { Metadata } from 'next'
import { FiltersProvider } from '@/shared/providers/Filters'
import { getCities, getRegions } from '@/entities/warehouse'

export const revalidate = 600

type Args = {
  searchParams: Promise<{ [key: string]: string }>
}

export default async function Page({ searchParams: paramsPromice }: Args) {
  const params = await paramsPromice

  const allCategories = await getAllCategoriesWithParents()

  const productsData = await getProducts({
    page: params.page,
    categorySlug: params.category,
    brandsSlug: params.brands,
    phrase: params.phrase,
    allCategories,
    condition: params.condition,
    city: params.city,
    region: params.region,
  })
  const brandsData = await getBrands()
  const regionsData = await getRegions()
  const citiesData = await getCities(params.region)

  if (productsData.invalidCategory) return notFound()

  return (
    <FiltersProvider>
      <ProductsCatalogView
        products={productsData.products}
        pagination={productsData.pagination}
        currentCategory={productsData.currentCategory}
        allCategories={allCategories}
        brands={brandsData}
        regions={regionsData}
        cities={citiesData}
      />
    </FiltersProvider>
  )
}

export async function generateMetadata({ searchParams: paramsPromice }: Args): Promise<Metadata> {
  const { category: categorySlug } = await paramsPromice

  let pageTitle = 'Каталог товаров: промышленное оборудование и запчасти'

  if (categorySlug && typeof categorySlug === 'string') {
    const category = await getCategoryBySlug(categorySlug)
    if (category && category[0]?.title) {
      pageTitle = `${category[0].title} | Каталог товаров`
    }
  }

  const pseudoDoc = {
    title: pageTitle,
    slug: 'products',
  }

  return generateMeta({ doc: pseudoDoc })
}
