'use client'

import { ImageMedia } from '@/components/Media/ImageMedia'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Product, Media } from '@/payload-types'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  if (!product) {
    return null
  }

  const altText = (product.productImage as Media | null)?.alt || product.name

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
      className="h-full flex w-full max-w-sm flex-col overflow-hidden pt-0 shadow-none transition-[box-shadow,transform] duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer sm:max-w-full"
    >
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden border-b sm:h-[200px]">
          <ImageMedia
            alt={altText}
            resource={product.productImage}
            fill
            imgClassName="object-contain"
            pictureClassName="absolute inset-0 h-full w-full bg-white"
          />
        </div>
      </CardHeader>
      <CardContent className="grow p-4 sm:pt-5 bg-muted">
        <div className="flex flex-col gap-3 sm:gap-5">
          <h4 className="text-base font-semibold">{product?.sku}</h4>
          <div className="line-clamp-3 text-sm text-muted-foreground">{product?.name}</div>
        </div>
      </CardContent>
    </Card>
  )
}
