import { CollectionBeforeChangeHook } from 'payload'
import { Address, Warehouse } from '@/payload-types'

export const beforeChangeHook: CollectionBeforeChangeHook<Warehouse> = async ({
  data,
  req: { payload, user },
}) => {
  // Проверяем, выбрал ли пользователь новый адрес в UI-компоненте
  if (
    data.selectedAddressData &&
    typeof data.selectedAddressData === 'object' &&
    data.selectedAddressData !== null
  ) {
    // Проверяем, что это объект с необходимыми свойствами
    const suggestion = data.selectedAddressData as {
      value: string
      data: {
        fias_id: string
        kladr_id?: string
        city?: string
        settlement?: string
        region_with_type?: string
        street?: string
        house?: string
        geo_lat?: string
        geo_lon?: string
        country_iso_code?: string
      }
    }

    try {
      // 1. Ищем существующий адрес по FIAS ID
      const existing = await payload.find({
        collection: 'addresses',
        where: { fias_id: { equals: suggestion.data.fias_id } },
        limit: 1,
        user,
      })

      let addressDoc: Address | null = null

      if (existing.docs.length > 0) {
        // Адрес найден, используем его
        addressDoc = existing.docs[0]
        payload.logger.info(`Address found for warehouse. Using existing ID: ${addressDoc.id}`)
      } else {
        // Адрес не найден, создаем новый
        payload.logger.info(`No address found. Creating new entry for warehouse.`)
        addressDoc = await payload.create({
          collection: 'addresses',
          data: {
            fias_id: suggestion.data.fias_id,
            kladr_id: suggestion.data.kladr_id || '',
            city: suggestion.data.city || suggestion.data.settlement || '',
            region: suggestion.data.region_with_type || '',
            street: suggestion.data.street || '',
            house: suggestion.data.house || '',
            fullAddress: suggestion.value,
            geo_lat: suggestion.data.geo_lat,
            geo_lon: suggestion.data.geo_lon,
            country_iso_code: suggestion.data.country_iso_code,
          },
          user, // Передаем пользователя для мульти-тенантности, если нужно
        })
      }

      // 2. Обновляем основное поле `address` ID-шником найденного/созданного адреса
      data.warehouse_address = addressDoc.id
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error'
      payload.logger.error(`Error resolving address in beforeChange hook: ${errorMessage}`)
    }
  }

  // 3. Очищаем временное поле, чтобы оно не сохранилось в базу
  delete data.selectedAddressData

  // 4. Возвращаем измененный объект `data` для сохранения
  return data
}
