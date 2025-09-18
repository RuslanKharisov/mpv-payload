import { anyone } from '@/payload/access/anyone'
import { authenticated } from '@/payload/access/authenticated'
import { isHidden } from '@/payload/access/isHidden'
import { CollectionConfig } from 'payload'

export const Addresses: CollectionConfig = {
  slug: 'addresses',
  labels: { singular: 'Адрес', plural: 'Адреса' },
  admin: { useAsTitle: 'fullAddress', hidden: ({ user }) => !isHidden(user) },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'fias_id', type: 'text', required: true, unique: true },
    { name: 'kladr_id', type: 'text' },
    { name: 'city', type: 'text' },
    { name: 'street', type: 'text' },
    { name: 'house', type: 'text' },
    { name: 'fullAddress', type: 'text' },
    { name: 'geo_lat', type: 'text' },
    { name: 'geo_lon', type: 'text' },
  ],
}
