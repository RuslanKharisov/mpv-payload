import React from 'react'
import { notFound } from 'next/navigation'
import { getAllCategories } from '@/entities/category'
import { getProducts } from '@/entities/products'
import { ProductsCatalogView } from '@/views/products/ui/products-catalog-view'
import getBrands from '@/entities/brands/api/get-brands'
import { mergeOpenGraph } from '@/shared/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/shared/utilities/getURL'
import { getCategoryBySlug } from '@/entities/category/api/get-category-by-slug'

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

export async function generateMetadata({ searchParams: paramsPromice }: Args) {
  const { category: categorySlug } = await paramsPromice
  let title = 'Prom-Stock — Каталог товаров: промышленное оборудование и запчасти'
  const description =
    'Широкий ассортимент промышленного оборудования, запчастей и расходников. Актуальные цены и наличие на складе.'

  if (categorySlug && typeof categorySlug === 'string') {
    const category = await getCategoryBySlug(categorySlug)
    title = `${category[0]?.title} | Каталог товаров | Prom-Stock.`
  }

  return {
    title: title,
    description: description,
    openGraph: mergeOpenGraph({
      title: title,
      description: description,
      url: `${getServerSideURL()}/products`,
    }),
    alternates: {
      canonical: `${getServerSideURL()}/products`,
    },
  }
}
