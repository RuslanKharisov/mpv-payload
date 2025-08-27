// import { authenticated } from '@/payload/access/authenticated'
import { CollectionConfig } from 'payload'

export const Companies: CollectionConfig = {
  slug: 'companies',
  admin: { useAsTitle: 'name' },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    // Связь с типом компании из глобального справочника. ToDo раскомментировать, когда будет создан справочник типов компаний
    {
      name: 'type',
      type: 'relationship',
      relationTo: 'company-types',
      required: true,
    },
    // Связь с адресом из канонического справочника. ToDo раскомментировать, когда будет создан справочник адресов
    {
      name: 'address',
      type: 'relationship',
      relationTo: 'addresses',
    },
    {
      name: 'status',
      type: 'select',
      options: ['PENDING', 'APPROVED', 'REJECTED'],
      defaultValue: 'PENDING',
      required: true,
    },
    // {
    //   name: 'layout',
    //   type: 'blocks',
    //   blocks: [
    //     // Здесь будут ваши блоки для конструктора страниц
    //     // { slug: 'hero', ... }, { slug: 'content', ... }
    //   ],
    // },
  ],
}
