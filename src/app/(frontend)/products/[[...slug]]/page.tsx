import configPromise from '@payload-config'
import { Metadata } from 'next/types'
import Link from 'next/link'
import { getPayload } from 'payload'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export default async function Page() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 12,
    overrideAccess: false,
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Продукты</h1>
        </div>
      </div>

      <div className="container mb-8">
        {/* Render products here */}
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8 justify-items-center">
          {products.docs.map((product) => (
            <div key={product.slug} className="col-span-4 xl:col-span-3">
              <Card className="w-full max-w-xs shadow-none pt-0 overflow-hidden h-[540px]">
                <CardHeader className="p-0">
                  {/* <div className="relative bg-muted border-b h-[296px] overflow-hidden">
                    <ImageMedia
                      resource={product.productImage}
                      size="33vw"
                      fill
                      imgClassName="object-cover object-center"
                    />
                  </div> */}
                </CardHeader>
                <CardContent className="grow">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold line-clamp-2">{product?.name}</h3>
                  </div>
                  {/* <div className="text-sm text-muted-foreground line-clamp-3">
                    {product?.shortDescription}
                  </div> */}
                </CardContent>
                <CardFooter className="mt-2 flex justify-between flex-col gap-2 grow-1">
                  <Link href={`/store/${product.slug}`} className="w-full">
                    <Button className="w-full" variant="outline" size="lg">
                      <span>Подробнее</span>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
