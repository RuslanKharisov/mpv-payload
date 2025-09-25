import { Typography } from '@/shared/ui/typography'
import { Product } from '@/payload-types'

type ProductInfoProps = {
  product: Product
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div className="flex flex-col gap-y-2 md:gap-y-4 w-full">
      <Typography tag="h2" variant="inter-md-16">
        {product?.name}
      </Typography>

      <Typography variant="inter-reg-14" tag="p">
        {product?.shortDescription}
      </Typography>
    </div>
  )
}

export { ProductInfo }
