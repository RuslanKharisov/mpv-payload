import type { TextField } from 'payload'
import { formatSkuHook } from './formatSku'

type Overrides = {
  fieldOverrides?: Partial<TextField>
}

/**
 * Создаёт скрытое поле sku_normalized, которое будет использоваться
 * для проверки уникальности SKU (без учёта регистра и спецсимволов).
 */
export const skuNormalizedField = (sourceField = 'sku', overrides: Overrides = {}): TextField => {
  const { fieldOverrides } = overrides

  // @ts-expect-error - ts не понимает merge Partial<TextField> с TextField
  const skuField: TextField = {
    name: 'sku_normalized',
    type: 'text',
    unique: true,
    index: true,
    hooks: {
      beforeValidate: [formatSkuHook(sourceField)],
    },
    admin: {
      // ToDO в продакшн скрыть поле
      // hidden: true,
      readOnly: true,
      position: 'sidebar',
      components: {
        Field: {
          path: '@/payload/fields/skuNormalized/SkuNormalizedComponent#SkuNormalizedComponent',
          clientProps: {
            fieldToUse: sourceField,
          },
        },
      },
    },
    ...fieldOverrides,
  }

  return skuField
}
