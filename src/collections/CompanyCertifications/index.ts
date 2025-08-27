import { CollectionConfig } from 'payload'

export const CompanyCertifications: CollectionConfig = {
  slug: 'company-certifications',
  labels: { singular: 'Сертификация', plural: 'Сертификации компании' },
  admin: { useAsTitle: 'name', group: 'Компания и аккаунт' },
  fields: [{ name: 'name', type: 'text', required: true }],
}
