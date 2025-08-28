import type { FieldHook } from 'payload'
import slugify from 'slugify'

/**
 * Нормализует SKU:
 * - приводит к нижнему регистру
 * - убирает всё, кроме латиницы, кириллицы и цифр
 */
// export const formatSku = (val: string): string => val.toLowerCase().replace(/[^a-zа-я0-9]/gi, '')
export const formatSku = (val: string): string =>
  slugify(val, {
    replacement: '',
    lower: true,
    strict: true, // удаляет спецсимволы
    locale: 'ru', // поддержка русских символов
  })

export const formatSkuHook =
  (fallback: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === 'string') {
      return formatSku(value)
    }

    if (operation === 'create' || !data?.slug) {
      const fallbackData = data?.[fallback] || data?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return formatSku(fallbackData)
      }
    }
    return value
  }
