import { CollectionConfig } from 'payload'

export const Currencies: CollectionConfig = {
  slug: 'currencies',
  labels: { singular: 'Валюта', plural: 'Валюты' },
  admin: { useAsTitle: 'code', group: 'Справочники' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Код валюты (ISO 4217)',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Название валюты',
    },
    {
      name: 'symbol',
      type: 'text',
      label: 'Символ (₽, $, €)',
    },
  ],
}
