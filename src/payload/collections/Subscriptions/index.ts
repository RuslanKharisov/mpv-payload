import { anyone } from '@/payload/access/anyone'
import { isSuperAdminAccess } from '@/payload/access/isSuperAdmin'
import { CollectionConfig } from 'payload'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  labels: { singular: 'Подписка', plural: 'Подписки' },
  access: {
    create: isSuperAdminAccess,
    delete: isSuperAdminAccess,
    read: anyone,
    update: isSuperAdminAccess,
  },
  admin: { useAsTitle: 'id', group: 'Профиль и инфо о компании' },
  fields: [
    { name: 'startDate', type: 'date', required: true },
    { name: 'endDate', type: 'date' },
    { name: 'tariff', type: 'relationship', relationTo: 'tariffs', required: true },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Активна', value: 'active' },
        { label: 'Неактивна', value: 'inactive' },
        { label: 'Ожидает оплаты', value: 'pending_payment' },
        { label: 'Истекла', value: 'expired' },
      ],
      defaultValue: 'inactive',
    },
  ],
}
