import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ProductCategory } from '@/payload-types'
import { CategoryAccordion } from '@/components/CategoryAccordion'
import { generateMeta } from '@/shared/utilities/generateMeta'
import { getAllCategoriesWithParents } from '@/entities/category/api/get-all-categories'

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const categories = await getAllCategoriesWithParents()

  return (
    <div className="py-8 lg:py-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Поиск оборудования промышленной автоматики по категориям</h1>
          <p>
            В Prom-Stock мы поможем вам найти именно те компоненты промышленной автоматизации,
            которые вам действительно нужны. Мы свяжем вас с надежными поставщиками, предлагающими
            широкий ассортимент компонентов: от модулей ПЛК и панелей HMI до датчиков, двигателей,
            приводов и автоматических выключателей. Просмотрите категории, чтобы легко найти
            доступные товары и оптимизировать процесс поиска.
          </p>
        </div>
      </div>

      <div className="container">
        <CategoryAccordion categories={categories as unknown as ProductCategory[]} />
      </div>
    </div>
  )
}

export async function generateMetadata() {
  const pseudoDoc = {
    meta: {
      title: 'Prom-Stock — Категории АСУТП продукции: оборудование, запчасти и комплектующие.',
      description:
        'Перейдите в раздел категорий и найдите нужный тип товара: оборудование, запчасти и комплектующие Prom-Stock. Удобные фильтры и навигация.',
      slug: 'product-categories',
    },
  }

  return generateMeta({ doc: pseudoDoc })
}
