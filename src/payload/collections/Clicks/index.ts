import { isSuperAdminAccess } from '@/payload/access/isSuperAdmin'
import type { CollectionConfig } from 'payload'

export const Clicks: CollectionConfig = {
  slug: 'clicks',
  labels: {
    singular: 'Click',
    plural: 'Clicks',
  },
  admin: {
    useAsTitle: 'target',
    defaultColumns: ['createdAt', 'src', 'ctx', 'companyId', 'tenant', 'target'],
  },
  access: {
    read: isSuperAdminAccess,
    create: () => false,
    update: () => false,
    delete: isSuperAdminAccess,
  },
  timestamps: true,
  fields: [
    {
      name: 'companyId',
      type: 'text',
      required: false,
      admin: { description: 'ID компании из RAG / OnStock (например, neftegaz-2026-123)' },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants', // если у тебя коллекция так называется
      required: false,
    },
    {
      name: 'src',
      type: 'select',
      required: true,
      defaultValue: 'web',
      options: [
        { label: 'Web', value: 'web' },
        { label: 'AI assistant', value: 'ai' },
        { label: 'Telegram', value: 'telegram' },
        { label: 'Email', value: 'email' },
      ],
    },
    {
      name: 'ctx',
      type: 'text',
      required: false,
      admin: { description: 'Контекст кампании: neftegaz-2026, catalog, newsletter и т.п.' },
    },
    {
      name: 'query',
      type: 'text',
      required: false,
      admin: { description: 'Поисковый запрос пользователя (если есть)' },
    },
    {
      name: 'target',
      type: 'text',
      required: true,
      admin: { description: 'Итоговый URL, на который ушёл редирект (с UTM)' },
    },
    {
      name: 'ip',
      type: 'text',
      required: false,
    },
    {
      name: 'userAgent',
      type: 'text',
      required: false,
    },
  ],
}

export default Clicks
