import configPromise from '@payload-config'
import { Metadata } from 'next/types'
import Link from 'next/link'
import { getPayload } from 'payload'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Pagination } from '@/components/Pagination'
import { ProductsBlock } from '@/components/ProductsBlock'
import { Product } from '@/payload-types'

export default async function Page() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 4,
    overrideAccess: false,
  })
  console.log('products ==> ', products)

  return (
    <div className="py-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Продукты</h1>
        </div>
      </div>

      <div className="container mb-8">
        <ProductsBlock products={products.docs as Product[]} />
      </div>

      <div className="container">
        {products.totalPages > 1 && products.page && (
          <Pagination page={products.page} totalPages={products.totalPages} route="products" />
        )}
      </div>
    </div>
  )
}
