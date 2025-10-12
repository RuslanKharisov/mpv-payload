import Link from 'next/link'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Product } from '@/payload-types' // Убедитесь, что импортировали тип продукта
import { Button } from '@/shared/ui/button'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  if (!product) {
    return null
  }

  return (
    <Card className="flex h-[430px] w-full max-w-xs flex-col overflow-hidden pt-0 shadow-none transition-transform duration-300 hover:scale-[1.01]">
      <CardHeader className="p-0">
        <div className="relative h-[200px] overflow-hidden border-b bg-muted">
          {/* Используем поле из вашего типа Product, например `productImage` */}
          <ImageMedia
            resource={product.productImage}
            fill
            imgClassName="object-cover object-contain"
            pictureClassName="absolute inset-0 h-full w-full"
          />
        </div>
      </CardHeader>
      <CardContent className="grow pt-5">
        <div className="flex flex-col gap-5">
          <h4 className="text-base font-semibold">{product?.sku}</h4>
          <div className="line-clamp-3 text-sm text-muted-foreground">{product?.name}</div>
        </div>
      </CardContent>
      <CardFooter className="mt-2 flex grow-0 flex-col justify-between gap-2">
        <Link href={`/products/${product.slug}`} className="w-full">
          <Button className="w-full" variant="default" size="lg">
            <span>Подробнее</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
