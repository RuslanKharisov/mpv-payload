import { isHidden } from '@/access/isHidden'
import { CollectionConfig } from 'payload'

export const Tariffs: CollectionConfig = {
  slug: 'tariffs',
  labels: { singular: 'Тариф', plural: 'Тарифы' },
  admin: { useAsTitle: 'name', hidden: ({ user }) => !isHidden(user) },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'pricePerUnit', type: 'number', required: true },
  ],
}
