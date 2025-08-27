import { slugField } from '@/fields/slug'
import { CollectionConfig } from 'payload'

export const Manufacturers: CollectionConfig = {
  slug: 'manufacturers',
  labels: { singular: 'Производитель', plural: 'Производители' },
  admin: { useAsTitle: 'name', group: 'Компания и аккаунт' },
  fields: [{ name: 'name', type: 'text', required: true }, ...slugField('name')],
}
