// src/app/(frontend)/products/page.tsx
import React from 'react'
import { notFound } from 'next/navigation'
import { getAllCategories } from '@/entities/category'
import { getProducts } from '@/entities/products'
import { ProductsCatalogView } from '@/views/products/ui/products-catalog-view'

export const revalidate = 60

type Args = {
  searchParams: Promise<{ [key: string]: string }>
}

export default async function Page({ searchParams: paramsPromice }: Args) {
  const { page, category: categorySlug, phrase } = await paramsPromice

  const allCategories = await getAllCategories()
  const productsData = await getProducts({ page, categorySlug, phrase, allCategories })

  if (productsData.invalidCategory) return notFound()

  return (
    <ProductsCatalogView
      products={productsData.products}
      pagination={productsData.pagination}
      currentCategory={productsData.currentCategory}
      allCategories={allCategories}
      activeCategorySlug={categorySlug}
      phrase={phrase}
    />
  )
}
