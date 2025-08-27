import { anyone } from '@/access/anyone'
import { isHidden } from '@/access/isHidden'
import { isSuperAdminAccess } from '@/access/isSuperAdmin'
import { CollectionConfig } from 'payload'

export const CompanyTypes: CollectionConfig = {
  access: {
    create: isSuperAdminAccess,
    delete: isSuperAdminAccess,
    read: anyone,
    update: isSuperAdminAccess,
  },
  slug: 'company-types',
  labels: { singular: 'Тип компании', plural: 'Типы компаний' },
  admin: { useAsTitle: 'name', hidden: ({ user }) => !isHidden(user) },
  fields: [{ name: 'name', type: 'text', required: true }],
}
