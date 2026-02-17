import React from 'react'
import { notFound } from 'next/navigation'
import { ProductInfo } from './product-info'
import { Product } from '@/payload-types'
import ImageGallery from './image-galery'

type ProductTemplateProps = {
  product: Product
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({ product }) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="flex flex-col justify-between gap-y-2 my-2">
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full h-fit"
        data-testid="product-container"
      >
        <ImageGallery product={product} />
        <div className="flex flex-col bg-card rounded-xl w-full gap-6 items-start justify-center small:p-20 p-6 h-full">
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  )
}

export { ProductTemplate }
