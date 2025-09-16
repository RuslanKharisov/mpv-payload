import { CollectionConfig } from 'payload'

export const CompanyProjects: CollectionConfig = {
  slug: 'company-projects',
  labels: { singular: 'Проект', plural: 'Проекты компании' },
  admin: { useAsTitle: 'name', group: 'Профиль и инфо о компании' },
  fields: [{ name: 'name', type: 'text', required: true }],
}
