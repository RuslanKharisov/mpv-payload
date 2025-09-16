import { CollectionConfig } from 'payload'

export const CompanyCertifications: CollectionConfig = {
  slug: 'company-certifications',
  labels: { singular: 'Сертификация', plural: 'Сертификации компании' },
  admin: { useAsTitle: 'name', group: 'Профиль и инфо о компании' },
  fields: [{ name: 'name', type: 'text', required: true }],
}
