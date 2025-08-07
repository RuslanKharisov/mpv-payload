import { CollectionConfig } from 'payload'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: { singular: 'Категория продукта', plural: 'Категории продуктов' },
  admin: { useAsTitle: 'name' },
  fields: [{ name: 'name', type: 'text', required: true }],
}
