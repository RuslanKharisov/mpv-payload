import { CollectionConfig } from 'payload'
import { beforeChangeHook } from './hooks/resolveAddress'

export const Warehouses: CollectionConfig = {
  slug: 'warehouses',
  labels: { singular: 'Склад', plural: 'Склады и адреса' },
  admin: { useAsTitle: 'title', group: 'Управление складом' },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    beforeChange: [beforeChangeHook],
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
              addressRelationPath: 'warehouse_address',
              selectedAddressDataPath: 'selectedAddressData',
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
    {
      name: 'selectedAddressData',
      type: 'json',
      admin: {
        hidden: true, // Скрываем его из интерфейса
      },
    },
    {
      name: 'capacity',
      label: 'Максимальная вместимость (шт.)',
      type: 'number',
      min: 0,
      max: 5000,
      defaultValue: 0,
      admin: {
        description:
          'Максимальное суммарное количество товаров на этом складе. 0 или пусто = без ограничения.',
      },
    },
  ],
}
