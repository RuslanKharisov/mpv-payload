/**
 * Это страница для отображения категорий продуктов при включенной пагинации.
 * Она использует серверный компонент для получения данных о категориях
 * и отображает их с помощью компонента CategoryGrid.
 */

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Pagination } from '@/components/Pagination'
import { notFound } from 'next/navigation'
import { CategoryGrid } from '@/components/CategoryGrid'
import { ProductCategory } from '@/payload-types'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const sanitizedPageNumber = Number(pageNumber)
  const payload = await getPayload({ config: configPromise })

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const categories = await payload.find({
    collection: 'product-categories',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    page: sanitizedPageNumber,
  })

  console.log('categories ==> ', categories)
  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Просмотр деталей промышленной автоматики по категориям</h1>
        </div>
        <div className="container">
          <CategoryGrid categories={categories.docs as unknown as ProductCategory[]} />
        </div>
      </div>

      <div className="container">
        {categories.totalPages > 1 && categories.page && (
          <Pagination
            page={categories.page}
            totalPages={categories.totalPages}
            route="product-categories"
          />
        )}
      </div>
    </div>
  )
}
