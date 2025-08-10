import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Pagination } from '@/components/Pagination'
import { notFound } from 'next/navigation'

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
          <h1>Categories</h1>
        </div>
        {categories.docs.map((category) => (
          <div key={category.id} className="mb-4">
            <h2>{category.title}</h2>
            {/* <p>{category.parent && category?.parent}</p> */}
          </div>
        ))}
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
