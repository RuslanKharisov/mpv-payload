import { CollectionConfig } from 'payload'

export const CompanyProjects: CollectionConfig = {
  slug: 'company-projects',
  labels: { singular: 'Проект', plural: 'Проекты компании' },
  admin: { useAsTitle: 'name', group: 'Tenant-Specific' },
  fields: [{ name: 'name', type: 'text', required: true }],
}
