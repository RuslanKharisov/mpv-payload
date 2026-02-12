import { Product } from '@/payload-types'
import { ProductCard } from '../ProductCard'
import { GeneralSearchModal } from '@/features/send-general-search-request/_ui/general-search-form'
import { Button } from '@/shared/ui/button'
import { SearchCode } from 'lucide-react'

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
        <div className="rounded-xl border-2 border-dashed border-muted bg-muted/30 py-20 px-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <SearchCode className="h-8 w-8" />
          </div>

          <h3 className="mb-2 text-xl font-semibold text-foreground">
            Оборудование не найдено в открытом каталоге
          </h3>

          <p className="mx-auto mb-8 max-w-md text-muted-foreground">
            У нас более 150 партнеров с закрытыми списками неликвидов. Оставьте запрос, и мы вручную
            проверим наличие нужного артикула.
          </p>

          <GeneralSearchModal
            trigger={
              <Button
                size="lg"
                variant="destructive"
                className="px-8 shadow-lg shadow-destructive/20"
              >
                Оставить запрос на поиск
              </Button>
            }
          />

          <p className="mt-4 text-xs text-muted-foreground italic">
            Это бесплатно и ни к чему вас не обязывает
          </p>
        </div>
      )}
    </>
  )
}
