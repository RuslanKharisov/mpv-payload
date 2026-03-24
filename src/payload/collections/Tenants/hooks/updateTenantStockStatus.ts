import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

/**
 * Вспомогательная функция для обновления статуса тенанта
 */
async function syncTenantStockStatus(payload: any, tenantField: any) {
  // Извлекаем ID тенанта (поддерживает и объект, и ID)
  const tenantId = typeof tenantField === 'object' ? tenantField?.id : tenantField

  if (!tenantId) return

  try {
    // Проверяем наличие хотя бы одного стока
    const stocks = await payload.find({
      collection: 'stocks',
      where: {
        tenant: { equals: tenantId },
      },
      limit: 1,
      depth: 0,
      pagination: false,
    })

    const hasStock = stocks.totalDocs > 0

    // Обновляем тенанта напрямую в базе
    await payload.update({
      collection: 'tenants',
      id: tenantId,
      data: {
        hasActiveStock: hasStock,
      },
      overrideAccess: true, // Игнорируем права текущего юзера
      depth: 0, // Не дергаем лишние связи
    })
  } catch (error) {
    payload.logger.error(
      `[Hook Error] Failed to sync stock status for tenant ${tenantId}: ${error}`,
    )
  }
  try {
    revalidateTag('tenants')
    payload.logger.info('Cache revalidated for tag: tenants')
  } catch (e) {}
}

/**
 * Хук после создания или обновления стока
 */
export const updateTenantStockAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  const { payload } = req

  // 1. Синхронизируем текущего тенанта из документа
  await syncTenantStockStatus(payload, doc?.tenant)

  // 2. Если тенант изменился (перенесли сток на другую компанию), обновляем и старого
  const oldTenantId =
    typeof previousDoc?.tenant === 'object' ? previousDoc?.tenant?.id : previousDoc?.tenant
  const newTenantId = typeof doc?.tenant === 'object' ? doc?.tenant?.id : doc?.tenant

  if (oldTenantId && oldTenantId !== newTenantId) {
    await syncTenantStockStatus(payload, oldTenantId)
  }

  return doc
}

/**
 * Хук после удаления стока
 */
export const updateTenantStockAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  // После удаления просто пересчитываем статус для тенанта, которому принадлежал сток
  await syncTenantStockStatus(req.payload, doc?.tenant)
  return doc
}
