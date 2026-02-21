import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Product, PromotedProductsBlock as Props } from '@/payload-types'
import { Typography } from '@/shared/ui/typography'
import { PromotedProductsCarousel } from './_ui/PromotedProductsCarousel'

// динамический запрос данных
export const dynamic = 'force-dynamic'

export const PromotedProductsBlock: React.FC<Props> = async ({ title, limit }) => {
  const payload = await getPayload({ config: configPromise })
  const productsPerPage = limit || 8

  // --- ЛОГИКА ПОЛУЧЕНИЯ ДАННЫХ ОСТАЕТСЯ БЕЗ ИЗМЕНЕНИЙ ---
  const { totalDocs } = await payload.find({
    collection: 'stocks',
    where: { isPromoted: { equals: true } },
    limit: 0,
  })

  if (totalDocs === 0) return null

  const totalPages = Math.ceil(totalDocs / productsPerPage)
  const randomPage = Math.floor(Math.random() * totalPages) + 1

  const { docs: promotedStocks } = await payload.find({
    collection: 'stocks',
    where: { isPromoted: { equals: true } },
    limit: productsPerPage,
    page: randomPage,
    sort: '-updatedAt',
    depth: 2,
  })
  // --- КОНЕЦ ЛОГИКИ ПОЛУЧЕНИЯ ДАННЫХ ---

  // --- ЛОГИКА ПОДГОТОВКИ ДАННЫХ ДЛЯ КЛИЕНТСКОГО КОМПОНЕНТА ---
  const productsData: Product[] = promotedStocks
    .map((stockItem) => {
      // Извлекаем вложенный объект Product
      const product = stockItem.product
      // Убеждаемся, что это полноценный объект, а не ID
      if (typeof product === 'object' && product !== null) {
        return product
      }
      return null
    })
    .filter((product): product is Product => product !== null) // Отфильтровываем null-значения

  if (productsData.length === 0) {
    return null
  }

  return (
    <div className="container py-8 md:py-16">
      <Typography tag="h2" className="text-center mb-12">
        {title}
      </Typography>
      <PromotedProductsCarousel products={productsData} />
    </div>
  )
}
