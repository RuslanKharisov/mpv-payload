import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RenderBlocks } from '@/payload/blocks/RenderBlocks'
import notFound from '../../not-found'

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()

  const { slug = '' } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  console.log('slug ==> ', slug)
  const tenant = await payload.find({
    collection: 'tenants',
    where: {
      slug: {
        equals: slug,
      },
    },
    draft,
    depth: 2,
  })

  console.log('tenant ==> ', tenant)

  if (!tenant.docs?.[0]) {
    return notFound()
  }

  const data = tenant.docs[0]

  return (
    <div>
      {/* {data.hero && <Hero {...data.hero} />} */}
      {data.layout && <RenderBlocks blocks={data.layout} />}
    </div>
  )
}
