import { CollectionConfig } from 'payload'

export const CompanyPosts: CollectionConfig = {
  slug: 'company-posts',
  labels: { singular: 'Пост компании', plural: 'Посты компании' },
  admin: { useAsTitle: 'title', group: 'Tenant-Specific' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'content', type: 'json' },
  ],
}
