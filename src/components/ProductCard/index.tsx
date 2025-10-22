'use client'

import { ImageMedia } from '@/components/Media/ImageMedia'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Product } from '@/payload-types'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: Product
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
      className="flex h-[375px] w-full max-w-xs flex-col overflow-hidden pt-0 shadow-none transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      <CardHeader className="p-0">
        <div className="relative h-[200px] overflow-hidden border-b bg-muted">
          <ImageMedia
            resource={product.productImage}
            fill
            imgClassName="object-cover object-contain"
            pictureClassName="absolute inset-0 h-full w-full "
          />
        </div>
      </CardHeader>
      <CardContent className="grow pt-5">
        <div className="flex flex-col gap-5">
          <h4 className="text-base font-semibold">{product?.sku}</h4>
          <div className="line-clamp-3 text-sm text-muted-foreground">{product?.name}</div>
        </div>
      </CardContent>
    </Card>
  )
}
