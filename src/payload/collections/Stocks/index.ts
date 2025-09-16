import { authenticated } from '@/payload/access/authenticated'
import { checkTenantFeatureAccess } from '@/payload/access/hasActiveFeature'
import { CollectionConfig } from 'payload'

export const Stocks: CollectionConfig = {
  slug: 'stocks',
  labels: { singular: 'СКЛАД', plural: 'СКЛАД' },
  access: {
    read: authenticated,
    create: checkTenantFeatureAccess('CAN_MANAGE_STOCK'),
    update: authenticated,
    delete: authenticated,
  },
  admin: { useAsTitle: 'title_in_admin', group: 'Управление складом' },
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
      name: 'currency',
      type: 'relationship',
      relationTo: 'currencies',
      required: true,
      label: 'Валюта',
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
    {
      name: 'isPromoted',
      label: 'Продвигать товар',
      type: 'checkbox',
      defaultValue: false,
      access: {
        // Редактировать это поле могут только те, у кого есть фича 'CAN_PROMOTE_PRODUCTS'
        update: async (args) => {
          const result = await checkTenantFeatureAccess('CAN_PROMOTE_PRODUCTS')(args)
          console.log('result ==> ', result)
          return typeof result === 'boolean' ? result : true
        },
        // Видят поле все, кто может редактировать сам документ
        read: () => true,
      },
      admin: {
        description: 'Отметьте, чтобы товар появился в карусели на главной странице.',
        // Можно даже скрыть поле, если нет доступа
        condition: (data, siblingData, { user }) => {
          // Эта логика сложнее и требует асинхронной проверки,
          // но можно реализовать через кастомный UI компонент
          return true
        },
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
