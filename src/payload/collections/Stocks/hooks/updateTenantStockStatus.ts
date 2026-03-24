import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

// Функция синхронизации, которую вызывают оба хука
async function syncStatus(payload: any, tenantField: any, req: any) {
  const { transactionID } = req
  const tenantId = typeof tenantField === 'object' ? tenantField?.id : tenantField

  if (!tenantId) return

  try {
    await payload.db.beginTransaction(transactionID)

    const stocks = await payload.find({
      collection: 'stocks',
      where: { tenant: { equals: tenantId } },
      limit: 1,
      depth: 0,
      pagination: false,
      req,
    })

    await payload.update({
      collection: 'tenants',
      id: tenantId,
      data: { hasActiveStock: stocks.totalDocs > 0 },
      overrideAccess: true,
      depth: 0,
      req,
    })

    await payload.db.commitTransaction(transactionID)

    // Ревалидация после успешного коммита
    try {
      revalidateTag('tenants')
    } catch (e) {}
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID)
    payload.logger.error(`[Stock Hook Error] Tenant ${tenantId}: ${error}`)
  }
}

export const updateTenantStockAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  // Синхронизируем текущего тенанта
  await syncStatus(req.payload, doc?.tenant, req)

  // Если тенант у стока изменился, обновляем и старого
  const oldId =
    typeof previousDoc?.tenant === 'object' ? previousDoc?.tenant?.id : previousDoc?.tenant
  const newId = typeof doc?.tenant === 'object' ? doc?.tenant?.id : doc?.tenant
  if (oldId && oldId !== newId) {
    await syncStatus(req.payload, oldId, req)
  }
  return doc
}

export const updateTenantStockAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await syncStatus(req.payload, doc?.tenant, req)
  return doc
}
