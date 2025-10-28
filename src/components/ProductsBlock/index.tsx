import { Product } from '@/payload-types'
import { ProductCard } from '../ProductCard'

interface ProductsBlockProps {
  products?: Product[]
}

export function ProductsBlock({ products }: ProductsBlockProps) {
  return (
    <>
      {products && products.length > 0 ? (
        <div className="mb-4 grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-gray-50 py-16 text-center dark:bg-gray-800">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Поиск товаров не дал результатов.
          </p>
        </div>
      )}
    </>
  )
}
