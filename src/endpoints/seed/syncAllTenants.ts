import { Payload } from 'payload'

export const syncAllTenants = async (payload: Payload) => {
  payload.logger.info('Начинаю синхронизацию статусов наличия для всех компаний...')

  // 1. Получаем всех тенантов (без пагинации, чтобы обработать всех)
  const tenants = await payload.find({
    collection: 'tenants',
    limit: 0,
    depth: 0,
  })

  payload.logger.info(`Найдено компаний: ${tenants.totalDocs}`)

  for (const tenant of tenants.docs) {
    // 2. Проверяем наличие хотя бы одного стока для этого тенанта
    const stocks = await payload.find({
      collection: 'stocks',
      where: {
        tenant: { equals: tenant.id },
        quantity: { greater_than: 0 },
      },
      limit: 1,
      depth: 0,
    })

    const hasStock = stocks.totalDocs > 0

    // 3. Обновляем тенанта, если статус изменился
    if (tenant.hasActiveStock !== hasStock) {
      await payload.update({
        collection: 'tenants',
        id: tenant.id,
        data: {
          hasActiveStock: hasStock,
        },
        context: { disableRevalidate: true },
        overrideAccess: true,
      })
      payload.logger.info(`Компания "${tenant.name}" обновлена: ${hasStock}`)
    }
  }

  payload.logger.info('✅ Синхронизация завершена успешно!')
}
