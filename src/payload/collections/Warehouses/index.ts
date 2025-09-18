import { CollectionConfig } from 'payload'

export const Warehouses: CollectionConfig = {
  slug: 'warehouses',
  labels: { singular: 'Склад', plural: 'Склады' },
  admin: { useAsTitle: 'title', group: 'Управление складом' },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Название склада',
      type: 'text',
      required: true,
    },
    {
      name: 'find',
      label: 'Найти адрес',
      type: 'ui',
      admin: {
        components: {
          Field: {
            path: '@/payload/collections/Warehouses/ui/DaDataAddressField',
            clientProps: {
              path: 'warehouse_address',
            },
          },
        },
      },
    },
    {
      name: 'warehouse_address',
      label: 'Адрес склада',
      type: 'relationship',
      relationTo: 'addresses',
      required: true,
      admin: {
        readOnly: true,
      },
    },
  ],
}
