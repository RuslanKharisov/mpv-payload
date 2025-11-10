import { generateMeta } from '@/shared/utilities/generateMeta'
import { CartWidget } from '@/widgets/cart'
import { Metadata } from 'next'

export default async function CartPage() {
  return <CartWidget />
}

export async function generateMetadata(): Promise<Metadata> {
  const pseudoDoc = {
    meta: {
      title: 'Корзина - Prom-Stock',
      description: 'Управление списком товаров, добавленных в корзину -  Prom-Stock',
    },
  }

  return generateMeta({ doc: pseudoDoc })
}
