import { CollectionConfig } from 'payload'

export const Stocks: CollectionConfig = {
  slug: 'stocks',
  labels: { singular: 'Остаток', plural: 'Остатки' },
  admin: { useAsTitle: 'id' },
  fields: [
    { name: 'quantity', type: 'number', required: true },
    { name: 'product', type: 'relationship', relationTo: 'products', required: true },
  ],
}
