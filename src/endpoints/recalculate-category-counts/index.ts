import {
  updateBrandCount,
  updateCategoryHierarchy,
} from '@/payload/collections/Products/hooks/syncProductStats'
import { Endpoint } from 'payload'

export const recalculateCountsEndpoint: Endpoint = {
  path: '/recalculate-counts',
  method: 'post',
  handler: async (req) => {
    if (!req.user) return new Response('Unauthorized', { status: 401 })

    const { payload } = req

    try {
      // 1. Очистка счетчиков

      await Promise.all([
        payload.update({
          collection: 'product-categories',
          where: { id: { exists: true } },
          data: { productCount: 0 },
        }),
        payload.update({
          collection: 'brands',
          where: { id: { exists: true } },
          data: { productCount: 0 },
        }),
      ])

      // 2. Получаем все опубликованные товары
      const products = await payload.find({
        collection: 'products',
        limit: 0,
        depth: 0,
      })

      // 3. Пересчет количества
      for (const product of products.docs) {
        // Пересчет категорий
        if (product.productCategory) {
          const catId =
            typeof product.productCategory === 'object'
              ? product.productCategory.id
              : product.productCategory

          await updateCategoryHierarchy(payload, catId, 1)
        }

        // Пересчет брендов (теперь тоже через функцию-помощник)
        if (product.brand) {
          const brandId = typeof product.brand === 'object' ? product.brand.id : product.brand

          await updateBrandCount(payload, brandId, 1)
        }
      }

      return Response.json({ message: `Успешно пересчитано для ${products.totalDocs} товаров` })
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 500 })
    }
  },
}
