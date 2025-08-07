import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Продукт',
    plural: 'Продукты',
  },
  admin: { useAsTitle: 'name' },
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
  ],
}
