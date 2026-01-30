import { anyone } from '@/payload/access/anyone'
import { isSuperAdminAccess } from '@/payload/access/isSuperAdmin'
import { slugField } from '@/payload/fields/slug'
import { CollectionConfig } from 'payload'

export const Brands: CollectionConfig = {
  slug: 'brands',
  access: {
    create: isSuperAdminAccess,
    delete: isSuperAdminAccess,
    read: anyone,
    update: isSuperAdminAccess,
  },
  labels: { singular: 'Производитель', plural: 'Производители' },
  admin: { useAsTitle: 'name', group: 'Продукция' },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Описание производителя',
      admin: {
        description: 'Отображается в карточках на сайте',
        rows: 4,
      },
    },
    {
      name: 'isPromoted',
      label: 'Продвигать в сетке',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Отметьте, чтобы бренд отображался в сетке на главной странице или других блоках',
      },
    },
    ...slugField('name'),
  ],
}
