import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'
import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  labels: {
    singular: 'Продукт',
    plural: 'Продукты',
  },
  admin: { useAsTitle: 'name', group: 'Tenant-Specific' },
  fields: [
    { name: 'name', label: 'Наименование', type: 'text', required: true },
    { name: 'sku', type: 'text', required: true, unique: true },
    {
      name: 'productCategory',
      type: 'relationship',
      relationTo: 'product-categories',
      required: true,
    },
    { name: 'manufacturer', type: 'relationship', relationTo: 'manufacturers' },
    ...slugField('name'),
  ],
}
