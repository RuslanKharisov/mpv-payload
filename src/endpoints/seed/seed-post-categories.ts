import type { Payload, PayloadRequest } from 'payload'
import { IPostCategoryData, postCategoriesData } from './data/post-categories-data'

export const seedPostCategories = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  console.log('Запущен сид категорий постов...')

  /* Очистка существующих категорий */
  await payload.db.deleteMany({
    collection: 'categories',
    req,
    where: {},
  })

  /* Рекурсивная функция для создания категорий и их дочерних элементов */
  const createCategoriesRecursive = async (
    categories: IPostCategoryData[],
    parentId: number | null = null,
  ) => {
    for (const category of categories) {
      const createdCategory = await payload.create({
        collection: 'categories',
        data: {
          title: category.title,
          parent: parentId,
        },
      })

      /* Рекурсивный вызов для дочерних категорий */
      if (category.children && category.children.length > 0) {
        await createCategoriesRecursive(category.children, createdCategory.id)
      }
    }
  }

  /* Создание категорий постов */
  console.log('Создание категорий постов...')
  await createCategoriesRecursive(postCategoriesData)

  console.log('Сид категорий постов успешно завершён!')
}
