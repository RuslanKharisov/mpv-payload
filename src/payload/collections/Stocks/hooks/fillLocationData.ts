import { CollectionBeforeChangeHook } from 'payload'

export const fillLocationData: CollectionBeforeChangeHook = async ({ data, req: { payload } }) => {
  if (data.warehouse) {
    try {
      // 1. Находим склад
      const warehouse = await payload.findByID({
        collection: 'warehouses',
        id: data.warehouse,
        depth: 1, // Чтобы достать объект address
      })

      if (warehouse && typeof warehouse.warehouse_address === 'object') {
        const address = warehouse.warehouse_address
        // 2. Копируем гео-данные в саму запись Stock
        data._city = address.city
        data._region = address.region
      }
    } catch (e) {
      console.error('Error filling location data for stock', e)
    }
  }
  return data
}
