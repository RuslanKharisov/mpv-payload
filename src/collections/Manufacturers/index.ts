import { CollectionConfig } from 'payload'

export const Manufacturers: CollectionConfig = {
  slug: 'manufacturers',
  labels: { singular: 'Производитель', plural: 'Производители' },
  admin: { useAsTitle: 'name' },
  fields: [{ name: 'name', type: 'text', required: true }],
}
