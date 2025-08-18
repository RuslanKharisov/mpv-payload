import { Product } from '@/payload-types'
import { ProductCard } from '../ProductCard'

interface ProductsBlockProps {
  products: Product[]
}

export function ProductsBlock({ products }: ProductsBlockProps) {
  return (
    <>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-4 justify-items-center gap-x-4 gap-y-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-8">
          {products.map((product) => (
            // Теперь используем наш переиспользуемый компонент
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-gray-50 py-16 text-center dark:bg-gray-800">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Товары не найдены.</p>
        </div>
      )}
    </>
  )
}
