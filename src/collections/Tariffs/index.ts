import { CollectionConfig } from 'payload'

export const Tariffs: CollectionConfig = {
  slug: 'tariffs',
  labels: { singular: 'Тариф', plural: 'Тарифы' },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'pricePerUnit', type: 'number', required: true },
  ],
}
