import { anyone } from '@/payload/access/anyone'
import { authenticated } from '@/payload/access/authenticated'
import { isSuperAdminAccess } from '@/payload/access/isSuperAdmin'
import { slugField } from '@/payload/fields/slug'
import { CollectionConfig } from 'payload'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  access: {
    create: isSuperAdminAccess,
    delete: isSuperAdminAccess,
    read: anyone,
    update: isSuperAdminAccess,
  },
  labels: {
    singular: 'Категория продукта',
    plural: 'Категории продуктов',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'breadcrumb', 'depth'],
    listSearchableFields: ['title', 'title_en', 'breadcrumb'],
    group: 'Компания и аккаунт',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Название категории (RU)',
    },
    {
      name: 'title_en',
      type: 'text',
      required: false, // Поле не обязательное
      label: 'Название категории (EN)',
    },
    {
      name: 'description',
      type: 'textarea', // Textarea лучше подходит для описаний
      required: false, // Поле не обязательное
      label: 'Описание категории',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'product-categories',
      label: 'Родительская категория',
    },
    {
      name: 'breadcrumb',
      type: 'text',
      admin: {
        readOnly: true,
      },
      label: 'Хлебные крошки (breadcrumb)',
    },
    {
      name: 'depth',
      type: 'number',
      admin: {
        readOnly: true,
      },
      label: 'Глубина вложенности',
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        if (!data.title) return data

        let breadcrumb = data.title
        let depth = 0

        // Найти родителя, если есть
        if (data.parent) {
          const parent = await req.payload.findByID({
            collection: 'product-categories',
            id: data.parent,
          })

          if (parent) {
            breadcrumb = `${parent.breadcrumb} > ${data.title}`
            depth = (parent.depth ?? 0) + 1
          }
        }

        return {
          ...data,
          breadcrumb,
          depth,
        }
      },
    ],
  },
}
