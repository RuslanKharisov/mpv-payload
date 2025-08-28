import { anyone } from '@/payload/access/anyone'
import { isSuperAdminAccess } from '@/payload/access/isSuperAdmin'
import { slugField } from '@/payload/fields/slug'
import { CollectionConfig } from 'payload'

export const Manufacturers: CollectionConfig = {
  slug: 'manufacturers',
  access: {
    create: isSuperAdminAccess,
    delete: isSuperAdminAccess,
    read: anyone,
    update: isSuperAdminAccess,
  },
  labels: { singular: 'Производитель', plural: 'Производители' },
  admin: { useAsTitle: 'name', group: 'Компания и аккаунт' },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    ...slugField('name'),
  ],
}
