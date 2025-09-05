import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { Pagination } from '@/components/Pagination'
import { Product } from '@/payload-types'
import { ProductsBlock } from '@/components/ProductsBlock'

type Args = {
  params: Promise<{ slug?: string; pageNumber: string }>
}

export default async function Page({ params: paramsPromice }: Args) {
  const { slug = '', pageNumber } = await paramsPromice
  const sanitizedPageNumber = Number(pageNumber)
  console.log('sanitizedPageNumber ==> ', sanitizedPageNumber)

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

  const productsData = await payload.find({
    collection: 'products',
    limit: 8,
    depth: 2,
    where: {
      'productCategory.id': {
        equals: category.id,
      },
    },
    page: sanitizedPageNumber,
  })

  return (
    <div className="py-24">
      <div className="container">
        <div className="prose dark:prose-invert max-w-none mb-12">
          <h1>{category.title}</h1>
          {category.description && <p>{category.description}</p>}
        </div>

        <div className="mt-16">
          {productsData.totalPages > 1 && productsData.page && (
            <Pagination
              page={productsData.page}
              totalPages={productsData.totalPages}
              route={`product-categories/${slug}`}
            />
          )}
        </div>

        <ProductsBlock products={productsData.docs as Product[]} />

        <div className="mt-16">
          {productsData.totalPages > 1 && productsData.page && (
            <Pagination
              page={productsData.page}
              totalPages={productsData.totalPages}
              route={`product-categories/${slug}`}
            />
          )}
        </div>
      </div>
    </div>
  )
}
