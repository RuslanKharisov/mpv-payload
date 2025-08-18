import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { Pagination } from '@/components/Pagination'
import { Product } from '@/payload-types'
import { ProductsBlock } from '@/components/ProductsBlock'

type Args = {
  params: { slug?: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ params, searchParams }: Args) {
  const { slug } = params
  const payload = await getPayload({ config: configPromise })

  const { docs: categories } = await payload.find({
    collection: 'product-categories',
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  const category = categories[0]

  if (!category) {
    return notFound()
  }

  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1

  const productsData = await payload.find({
    collection: 'products',
    limit: 12,
    page,
    depth: 2, // Добавим depth для загрузки изображений
    where: {
      'productCategory.id': {
        equals: category.id,
      },
    },
  })

  return (
    <div className="py-24">
      <div className="container">
        <div className="prose dark:prose-invert max-w-none mb-12">
          <h1>{category.title}</h1>
          {category.description && <p>{category.description}</p>}
        </div>

        {/* Используем тот же самый компонент для отображения сетки */}
        <ProductsBlock products={productsData.docs as Product[]} />

        {/* <div className="mt-16">
          {productsData.totalPages > 1 &&
            productsData.page(
              <Pagination
                page={productsData.page}
                totalPages={productsData.totalPages}
                baseUrl={`/product-categories/${slug}`}
              />,
            )}
        </div> */}
      </div>
    </div>
  )
}
