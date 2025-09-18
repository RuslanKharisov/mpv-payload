'use server' // <-- Обязательно указываем, что это серверный модуль

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Address } from '@/payload-types'

// Типизируем объект подсказки от DaData для надежности
type DaDataSuggestion = {
  value: string
  data: {
    fias_id: string
    kladr_id?: string
    city?: string
    settlement?: string
    street?: string
    house?: string
    geo_lat?: string
    geo_lon?: string
  }
}

/**
 * Серверная функция для поиска или создания адреса.
 * @param suggestion - Объект адреса, выбранный в подсказках DaData.
 * @returns ID документа адреса в коллекции 'addresses'.
 */
export const findOrCreateAddressAction = async (suggestion: DaDataSuggestion): Promise<number> => {
  console.log('suggestion ==> ', suggestion)
  const payload = await getPayload({ config: configPromise })

  try {
    // Ищем адрес по fias_id, чтобы избежать дубликатов
    const existing = await payload.find({
      collection: 'addresses',
      where: {
        fias_id: { equals: suggestion.data.fias_id },
      },
      limit: 1,
    })

    // Если адрес уже существует, возвращаем его ID
    if (existing.docs.length > 0) {
      payload.logger.info(
        `Address found with FIAS ID: ${suggestion.data.fias_id}. Using existing ID: ${existing.docs[0].id}`,
      )
      return existing.docs[0].id
    }

    // Если адрес не найден, создаем новый
    payload.logger.info(
      `No address found with FIAS ID: ${suggestion.data.fias_id}. Creating new entry.`,
    )
    const newAddress = await payload.create({
      collection: 'addresses',
      data: {
        fias_id: suggestion.data.fias_id,
        kladr_id: suggestion.data.kladr_id || '',
        city: suggestion.data.city || suggestion.data.settlement || '',
        street: suggestion.data.street || '',
        house: suggestion.data.house || '',
        fullAddress: suggestion.value,
        geo_lat: suggestion.data.geo_lat,
        geo_lon: suggestion.data.geo_lon,
      },
    })

    return newAddress.id
  } catch (error) {
    payload.logger.error(`Error in findOrCreateAddressAction: ${error}`)
    // В случае ошибки возвращаем пустую строку или выбрасываем исключение
    throw new Error('Failed to find or create address.')
  }
}
