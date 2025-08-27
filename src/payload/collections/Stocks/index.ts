import { authenticated } from '@/payload/access/authenticated'
import { CollectionConfig } from 'payload'

export const Stocks: CollectionConfig = {
  slug: 'stocks',
  labels: { singular: 'Мой склад', plural: 'Мой склад' },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: { useAsTitle: 'title_in_admin', group: 'Компания и аккаунт' },
  fields: [
    { name: 'quantity', label: 'Количество', type: 'number', required: true },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
      unique: false,
    },
    {
      name: 'price',
      label: 'Моя цена',
      type: 'number',
      admin: {
        description: 'Вы можете установить собственную цену на этот товар.',
      },
    },
    {
      name: 'title_in_admin',
      label: 'Наименование',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        afterRead: [
          async ({ data, req: { payload } }) => {
            const product = await payload.findByID({
              collection: 'products',
              id: data?.product,
              depth: 0,
            })
            return `${product.name} (SKU: ${product.sku})`
          },
        ],
      },
    },
  ],
  indexes: [
    {
      fields: ['product', 'tenant'],
      unique: true,
    },
  ],
}
