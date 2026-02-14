import { PayloadRedirects } from '@/components/PayloadRedirects'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'
import configPromise from '@payload-config'
import { RenderBlocks } from '@/payload/blocks/RenderBlocks'
import { ProductTemplate } from '@/components/ProductTemplate'
import { generateMeta } from '@/shared/utilities/generateMeta'
import { Metadata } from 'next'
import { SupplierStockWidget } from '@/widgets/supplier-stocks'

export const revalidate = 600

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
    <div className="py-8 lg:py-24">
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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise

  const product = await queryProductBySlug({ slug })

  return generateMeta({ doc: product })
}

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
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
