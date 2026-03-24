import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

// Функция синхронизации, которую вызывают оба хука
async function syncStatus(payload: any, tenantField: any, req: any) {
  const tenantId = typeof tenantField === 'object' ? tenantField?.id : tenantField

  if (!tenantId) return

  try {
    const stocks = await payload.find({
      collection: 'stocks',
      where: { tenant: { equals: tenantId } },
      limit: 1,
      depth: 0,
      req,
    })

    const hasStock = (stocks.totalDocs ?? 0) > 0

    await payload.update({
      collection: 'tenants',
      id: tenantId,
      data: { hasActiveStock: hasStock },
      overrideAccess: true,
      depth: 0,
      req,
    })

    // Ревалидация после успешного коммита
    try {
      revalidateTag('tenants')
    } catch (e) {}
  } catch (error) {
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
