import { CollectionConfig } from 'payload'

export const CompanyProjects: CollectionConfig = {
  slug: 'company-projects',
  labels: { singular: 'Проект', plural: 'Проекты компании' },
  admin: { useAsTitle: 'name' },
  fields: [{ name: 'name', type: 'text', required: true }],
}
