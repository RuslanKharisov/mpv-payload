import React, { cache } from 'react'
import { notFound } from 'next/navigation'
import { getAllCategories } from '@/entities/category'
import { getProducts } from '@/entities/products'
import { ProductsCatalogView } from '@/views/products/ui/products-catalog-view'
import getBrands from '@/entities/brands/api/get-brands'

export const revalidate = 600

type Args = {
  searchParams: Promise<{ [key: string]: string }>
}

export default async function Page({ searchParams: paramsPromice }: Args) {
  const { page, category: categorySlug, brands: brandsSlug, phrase } = await paramsPromice

  const allCategories = await getAllCategories()
  const productsData = await getProducts({ page, categorySlug, brandsSlug, phrase, allCategories })
  const bradsData = await getBrands()

  if (productsData.invalidCategory) return notFound()

  return (
    <ProductsCatalogView
      products={productsData.products}
      pagination={productsData.pagination}
      currentCategory={productsData.currentCategory}
      allCategories={allCategories}
      brands={bradsData}
      activeCategorySlug={categorySlug}
      selectedBrands={productsData.selectedBrandSlugs}
      phrase={phrase}
    />
  )
}
