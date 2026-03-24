import { isSuperAdminAccess } from '@/payload/access/isSuperAdmin'
import type { CollectionConfig } from 'payload'

export const CompanyTags: CollectionConfig = {
  slug: 'company-tags',
  labels: { singular: 'Тег компании', plural: 'Теги компании' },
  admin: { useAsTitle: 'name' },
  access: {
    read: () => true,
    create: isSuperAdminAccess,
    update: isSuperAdminAccess,
    delete: isSuperAdminAccess,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    { name: 'tenantCount', type: 'number', required: false, defaultValue: 0 },
  ],
}
