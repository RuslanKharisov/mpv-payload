import { CollectionConfig } from 'payload'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  labels: { singular: 'Подписка', plural: 'Подписки' },
  admin: { useAsTitle: 'id', group: 'Tenant-Specific' },
  fields: [
    { name: 'startDate', type: 'date', required: true },
    { name: 'endDate', type: 'date' },
    { name: 'tariff', type: 'relationship', relationTo: 'tariffs', required: true },
  ],
}
