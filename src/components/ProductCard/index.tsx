'use client'

import { ImageMedia } from '@/components/Media/ImageMedia'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Product, Media } from '@/payload-types'
import { WithPopulatedMany } from '@/shared/utilities/payload-types-extender'
import { useRouter } from 'next/navigation'

type ProductWithMedia = WithPopulatedMany<
  Product,
  {
    productImage: Media
  }
>

interface ProductCardProps {
  product: ProductWithMedia
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  if (!product) {
    return null
  }

  return (
    <Card
      onClick={() => product.slug && router.push(`/products/${product.slug}`)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && product.slug) {
          e.preventDefault()
          router.push(`/products/${product.slug}`)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
      className="flex w-full max-w-sm flex-col overflow-hidden pt-0 shadow-none transition-[box-shadow,transform] duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer sm:max-w-full"
    >
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden border-b bg-muted sm:h-[200px]">
          <ImageMedia
            alt={product.productImage.alt || ''}
            resource={product.productImage}
            fill
            imgClassName="object-cover object-contain"
            pictureClassName="absolute inset-0 h-full w-full"
          />
        </div>
      </CardHeader>
      <CardContent className="grow p-4 sm:pt-5">
        <div className="flex flex-col gap-3 sm:gap-5">
          <h4 className="text-base font-semibold">{product?.sku}</h4>
          <div className="line-clamp-3 text-sm text-muted-foreground">{product?.name}</div>
        </div>
      </CardContent>
    </Card>
  )
}
