import React from 'react'
import { notFound } from 'next/navigation'
import { getAllCategories } from '@/entities/category'
import { getProducts } from '@/entities/products'
import { ProductsCatalogView } from '@/views/products/ui/products-catalog-view'
import getBrands from '@/entities/brands/api/get-brands'
import { getCategoryBySlug } from '@/entities/category/api/get-category-by-slug'
import { generateMeta } from '@/shared/utilities/generateMeta'
import { Metadata } from 'next'

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

export async function generateMetadata({ searchParams: paramsPromice }: Args): Promise<Metadata> {
  const { category: categorySlug } = await paramsPromice

  let pageTitle = 'Каталог товаров: промышленное оборудование и запчасти'

  if (categorySlug && typeof categorySlug === 'string') {
    const category = await getCategoryBySlug(categorySlug)
    if (category && category[0]?.title) {
      pageTitle = `${category[0].title} | Каталог товаров`
    }
  }

  // ✅ Создаем "псевдо-документ" только с теми полями, которые нужны нашей утилите
  const pseudoDoc = {
    title: pageTitle,
    slug: 'products',
  }

  return generateMeta({ doc: pseudoDoc })
}
