import type { CollectionBeforeValidateHook } from 'payload'

/**
 *
 * @param param0
 * @returns Product Name. SKU: 12345. Warehouse Title
 */
export const setStockDefaults: CollectionBeforeValidateHook = async ({ data, req }) => {
  // 1. Если data undefined, подставляем пустой объект
  data ||= {}

  // 2. Автоматическая привязка tenant
  if (!data.tenant && req.user?.tenants?.length) {
    // Берём первого тенанта (или можно выбрать по другой логике)
    const firstTenant = req.user.tenants[0].tenant
    if (typeof firstTenant === 'object') {
      data.tenant = firstTenant.id
    } else {
      data.tenant = firstTenant
    }
  }

  // 3. Формируем title_in_admin
  if (data.product) {
    const p = await req.payload.findByID({
      collection: 'products',
      id: data.product,
      depth: 0,
    })

    let whName = ''
    if (data.warehouse) {
      const w = await req.payload.findByID({
        collection: 'warehouses',
        id: data.warehouse,
        depth: 0,
      })
      whName = w?.title ? `${w.title}` : ''
    }

    // Формат в админке: Product Name. SKU: 12345. Warehouse Title
    data.title_in_admin = `${p?.name ?? '—'}. SKU: ${p?.sku ?? '—'}. ${whName}`
  }

  return data
}
