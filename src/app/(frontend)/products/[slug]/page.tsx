import { PayloadRedirects } from '@/components/PayloadRedirects'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'
import configPromise from '@payload-config'
import { RenderBlocks } from '@/payload/blocks/RenderBlocks'
import { ProductTemplate } from '@/components/ProductTemplate'
import { SupplierStockWidget } from '@/widgets/supplier-stocks'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/products/' + slug
  const product = await queryProductBySlug({ slug })

  if (!product) return <PayloadRedirects url={url} />

  const { layout } = product

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <ProductTemplate product={product} />
      </div>
      {layout && <RenderBlocks blocks={layout} />}

      <div className="container mb-16">
        <SupplierStockWidget slug={slug} />
      </div>
    </div>
  )
}

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  console.log('slug ==> ', slug)
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
