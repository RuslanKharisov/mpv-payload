import { Typography } from '@/shared/ui/typography'
import { Product } from '@/payload-types'

type ProductInfoProps = {
  product: Product
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div className="flex flex-col gap-y-2 md:gap-y-4 w-full">
      <Typography tag="h1" className="text-center">
        {product?.name}
      </Typography>

      <Typography tag="p">{product?.shortDescription}</Typography>
    </div>
  )
}

export { ProductInfo }
