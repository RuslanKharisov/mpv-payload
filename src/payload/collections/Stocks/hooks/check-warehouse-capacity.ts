// src/payload/collections/Stocks/hooks/check-warehouse-capacity.ts
import { APIError, CollectionBeforeChangeHook } from 'payload'

export const checkWarehouseCapacity: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  // 1. Эта логика касается только СОЗДАНИЯ новых позиций на складе.
  // Обновление существующей позиции не меняет их общее количество.
  if (operation !== 'create') {
    return data
  }

  const warehouseId = data.warehouse

  // Если позиция создается без привязки к складу, проверять нечего.
  if (!warehouseId) {
    return data
  }

  // 2. Получаем данные о складе, включая его вместимость (лимит позиций)
  const warehouse = await req.payload.findByID({
    collection: 'warehouses',
    id: warehouseId,
  })

  // Если вместимость не установлена (0 или null), то она безлимитная.
  if (!warehouse.capacity || warehouse.capacity <= 0) {
    return data
  }

  // 3. Считаем, сколько позиций уже числится на этом складе.
  const stocksOnWarehouse = await req.payload.find({
    collection: 'stocks',
    where: {
      warehouse: {
        equals: warehouseId,
      },
    },
    // Нам не нужны сами документы, только их общее количество (totalDocs).
    // Это гораздо быстрее, чем загружать все документы.
    limit: 1,
  })

  const currentPositionCount = stocksOnWarehouse.totalDocs

  // 4. Сравниваем текущее количество с лимитом.
  // Поскольку мы в процессе СОЗДАНИЯ новой записи, мы должны проверить,
  // не превысит ли лимит текущее количество.
  if (currentPositionCount >= warehouse.capacity) {
    throw new APIError(
      // 5. "Дружелюбное" сообщение об ошибке для пользователя.
      `Достигнут лимит позиций для склада "${warehouse.title}". Вместимость: ${warehouse.capacity} поз.`,
      400, // Статус 400 (Bad Request) - это ошибка пользователя, а не сервера.
    )
  }

  return data
}
