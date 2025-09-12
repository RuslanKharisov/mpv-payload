import { anyone } from '@/payload/access/anyone'
import { isHidden } from '@/payload/access/isHidden'
import { isSuperAdminAccess } from '@/payload/access/isSuperAdmin'
import { CollectionConfig } from 'payload'

export const Tariffs: CollectionConfig = {
  slug: 'tariffs',
  access: {
    create: isSuperAdminAccess,
    delete: isSuperAdminAccess,
    read: anyone,
    update: isSuperAdminAccess,
  },
  labels: { singular: 'Тариф', plural: 'Тарифы' },
  admin: { useAsTitle: 'name', hidden: ({ user }) => !isHidden(user) },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          label: 'Название',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'price',
          label: 'Цена',
          type: 'number',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'description',
      label: 'Описание тарифа',
      type: 'textarea',
    },
    {
      name: 'benefits',
      label: 'Преимущества (для отображения на сайте)',
      type: 'array',
      labels: {
        singular: 'Преимущество',
        plural: 'Преимущества',
      },
      fields: [
        {
          name: 'value',
          label: 'Текст преимущества',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'features',
      label: 'Возможности тарифа',
      type: 'select',
      hasMany: true,
      required: true,
      admin: {
        description:
          'Выберите, какие платные функции будут доступны по этому тарифу. Это напрямую влияет на доступы.',
      },
      options: [
        {
          label: 'Ручное управление складом',
          value: 'CAN_MANAGE_STOCK',
        },
        {
          label: 'Создание постов компании',
          value: 'CAN_CREATE_POSTS',
        },
        {
          label: 'Продвижение товаров',
          value: 'CAN_PROMOTE_PRODUCTS',
        },
      ],
    },
  ],
}
