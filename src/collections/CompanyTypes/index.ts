import { CollectionConfig } from 'payload'

export const CompanyTypes: CollectionConfig = {
  slug: 'company-types',
  labels: { singular: 'Тип компании', plural: 'Типы компаний' },
  admin: { useAsTitle: 'name' },
  fields: [{ name: 'name', type: 'text', required: true }],
}
