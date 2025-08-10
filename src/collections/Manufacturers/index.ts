import { slugField } from '@/fields/slug'
import { CollectionConfig } from 'payload'

export const Manufacturers: CollectionConfig = {
  slug: 'manufacturers',
  labels: { singular: 'Производитель', plural: 'Производители' },
  admin: { useAsTitle: 'name', group: 'Tenant-Specific' },
  fields: [{ name: 'name', type: 'text', required: true }, ...slugField('name')],
}
