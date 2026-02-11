import { updateCategoryHierarchy } from '@/payload/collections/Products/hooks/syncCategoryProductCounts'
import { Endpoint } from 'payload'

export const recalculateCountsEndpoint: Endpoint = {
  path: '/recalculate-counts',
  method: 'post',
  handler: async (req) => {
    if (!req.user) return new Response('Unauthorized', { status: 401 })

    const { payload } = req

    try {
      // 1. Сбрасываем все счетчики в 0
      await payload.update({
        collection: 'product-categories',
        where: { id: { exists: true } },
        data: { productCount: 0 },
      })

      // 2. Получаем все опубликованные товары
      // Используйте depth: 0 для скорости
      const products = await payload.find({
        collection: 'products',
        limit: 0,
        depth: 0,
      })

      // 3. Используем нашу функцию для каждого товара
      // Важно: импортируйте updateCategoryHierarchy из вашего файла хуков
      for (const product of products.docs) {
        if (product.productCategory) {
          const catId =
            typeof product.productCategory === 'object'
              ? product.productCategory.id
              : product.productCategory

          await updateCategoryHierarchy(payload, catId, 1)
        }
      }

      return Response.json({ message: `Успешно пересчитано для ${products.totalDocs} товаров` })
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 500 })
    }
  },
}
