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

  console.log('product ==> ', product)
  return (
    <div className="flex flex-col gap-y-2 my-2">
      <div
        className="container grid grid-cols-1 md:grid-cols-2 gap-2 w-full h-fit"
        data-testid="product-container"
      >
        <ImageGallery product={product} />
        <div className="flex flex-col bg-secondary drop-shadow-lg rounded-xl w-full gap-6 items-start justify-center small:p-20 p-6 h-full">
          <ProductInfo product={product} />
        </div>
      </div>
      <div className="container" data-testid="related-products-container"></div>
    </div>
  )
}

export { ProductTemplate }
