import { authenticated } from '@/payload/access/authenticated'
import { checkTenantFeatureAccess } from '@/payload/access/hasActiveFeature'
import { CollectionConfig } from 'payload'
import { setStockDefaults } from './hooks/set-stock-defaults'
import { checkWarehouseCapacity } from './hooks/check-warehouse-capacity'
import { fillLocationData } from './hooks/fillLocationData'

export const Stocks: CollectionConfig = {
  slug: 'stocks',
  hooks: {
    beforeValidate: [setStockDefaults],
    beforeChange: [checkWarehouseCapacity, fillLocationData],
  },
  labels: { singular: 'СКЛАД', plural: 'СКЛАД' },
  access: {
    read: authenticated,
    create: checkTenantFeatureAccess('CAN_MANAGE_STOCK'),
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title_in_admin',
    group: 'Управление складом',
    // Import button moved to frontend: src/widgets/stocks/upload-excel-dialog.tsx
    // components: {
    //   beforeListTable: ['@/payload/collections/Stocks/ui/ImportStocksButton'],
    // },
  },
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
      name: 'condition',
      label: 'Состояние',
      type: 'select',
      options: [
        {
          label:
            'НОВЫЙ С ЗАВОДА - изделие абсолютно новое, не использовалось. Упаковка заводсткая.',
          value: 'НОВЫЙ С ЗАВОДА',
        },
        {
          label: 'НОВЫЙ ИЗЛИШЕК - изделие новое и неиспользованное, но хранилось длительное время.',
          value: 'НОВЫЙ ИЗЛИШЕК',
        },
        {
          label: 'Б/У - ранее использовалось, имеет следы износа. Полностью работоспособно.',
          value: 'Б/У',
        },
        {
          label:
            'ВОССТАНОВЛЕН - изделие ранее использовалось, но было восстановлено до состояния нового',
          value: 'ВОССТАНОВЛЕН',
        },
      ],
    },
    {
      name: 'expectedDelivery',
      label: 'Ожидаемая дата наличия',
      type: 'date',
    },
    {
      name: 'warranty',
      label: 'Гарантия (мес.)',
      type: 'number',
    },
    {
      name: 'warehouse',
      label: 'Склад',
      type: 'relationship',
      relationTo: 'warehouses',
      required: false,
    },
    {
      name: 'title_in_admin',
      label: 'Наименование',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: '_city',
      type: 'text',
      index: true,
      admin: { hidden: true },
    },
    {
      name: '_region',
      type: 'text',
      index: true,
      admin: { hidden: true },
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
      fields: ['product', 'tenant', 'warehouse'],
      unique: true,
    },
  ],
}
