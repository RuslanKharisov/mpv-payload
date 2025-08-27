import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { isSuperAdminAccess } from '@/access/isSuperAdmin'
import { isHidden } from '@/access/isHidden'

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
