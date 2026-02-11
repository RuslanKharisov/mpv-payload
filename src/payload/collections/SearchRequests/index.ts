import { CollectionConfig } from 'payload'
import { anyone } from '@/payload/access/anyone'
import { isSuperAdminAccess } from '@/payload/access/isSuperAdmin'
import { isHidden } from '@/payload/access/isHidden'

export const SearchRequests: CollectionConfig = {
  slug: 'search-requests',
  access: {
    create: anyone,
    delete: isSuperAdminAccess,
    read: isSuperAdminAccess,
    update: isSuperAdminAccess,
  },
  admin: { group: 'Лиды', useAsTitle: 'productName', hidden: ({ user }) => !isHidden(user) },
  fields: [
    { name: 'productName', type: 'text', required: true, label: 'Что ищут' },
    { name: 'companyName', type: 'text', required: true, label: 'Компания' },
    { name: 'email', type: 'email', required: true },
    {
      name: 'phone',
      type: 'text',
      label: 'Телефон для связи',
    },
    { name: 'note', type: 'textarea', label: 'Детали/Параметры' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Новый', value: 'new' },
        { label: 'В работе', value: 'process' },
      ],
    },
  ],
}
