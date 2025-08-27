import type { CollectionConfig } from 'payload'

import { anyone } from '@/payload/access/anyone'
import { slugField } from '@/payload/fields/slug'
import { isSuperAdminAccess } from '@/payload/access/isSuperAdmin'
import { isHidden } from '@/payload/access/isHidden'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: isSuperAdminAccess,
    delete: isSuperAdminAccess,
    read: anyone,
    update: isSuperAdminAccess,
  },
  labels: { singular: 'Категория', plural: 'Категории' },
  admin: {
    useAsTitle: 'title',
    group: 'Посты и страницы',
    hidden: ({ user }) => !isHidden(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
  ],
}
