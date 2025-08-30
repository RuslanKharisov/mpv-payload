import type { Payload, PayloadRequest } from 'payload'
import { productCategoriesData, ProductCategoryData } from './data/product-categories-data'

export const seedProductCategories = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  console.log('Запущен сид категорий...')

  /* Очистка существующих категорий */
  await payload.db.deleteMany({
    collection: 'product-categories',
    req,
    where: {},
  })

  await payload.db.deleteMany({
    collection: 'manufacturers',
    req,
    where: {},
  })

  /* Рекурсивная функция для создания категорий и их дочерних элементов */
  const createCategoriesRecursive = async (
    categories: ProductCategoryData[],
    parentId: number | null = null,
  ) => {
    for (const category of categories) {
      const createdCategory = await payload.create({
        collection: 'product-categories',
        data: {
          title: category.name_ru,
          title_en: category.name,
          description: category.description,
          parent: parentId,
        },
      })

      /* Рекурсивный вызов для дочерних категорий */
      if (category.children && category.children.length > 0) {
        await createCategoriesRecursive(category.children, createdCategory.id)
      }
    }
  }

  /* Создание категорий продуктов */
  console.log('Создание категорий продуктов...')
  await createCategoriesRecursive(productCategoriesData)

  console.log('Сид категорий продуктов успешно завершён!')
}
