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
    { name: 'name', type: 'text', required: true },
    { name: 'pricePerUnit', type: 'number', required: true },
  ],
}
