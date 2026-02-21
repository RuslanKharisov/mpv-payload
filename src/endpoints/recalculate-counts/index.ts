import { isSuperAdminAccess } from '@/payload/access/isSuperAdmin'
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
    if (!isSuperAdminAccess({ req })) return new Response('Forbidden', { status: 403 })

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

      // 2. Получаем все товары
      const products = await payload.find({
        collection: 'products',
        limit: 0,
        depth: 0,
      })

      const allStocks = await payload.find({ collection: 'stocks', limit: 0, depth: 0 })

      for (const stock of allStocks.docs) {
        // Вызов хука вручную или просто обновление через payload.update
        // Это пропишет _city и _region во все старые записи
        await payload.update({
          collection: 'stocks',
          id: stock.id,
          data: { id: stock.id }, // Trigger beforeChange hook
        })
      }

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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      return Response.json({ error: errorMessage }, { status: 500 })
    }
  },
}
