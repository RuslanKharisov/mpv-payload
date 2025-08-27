import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { isHidden } from '@/access/isHidden'
import { isSuperAdminAccess } from '@/access/isSuperAdmin'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { slugField } from '@/fields/slug'
import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: isSuperAdminAccess,
    delete: isSuperAdminAccess,
    read: anyone,
    update: isSuperAdminAccess,
  },
  labels: {
    singular: 'Продукт',
    plural: 'Продукты',
  },
  admin: {
    hidden: ({ user }) => !isHidden(user),
    useAsTitle: 'name',
    defaultColumns: ['name', 'sku', 'productCategory', 'updatedAt'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // --- ВКЛАДКА 1: ОСНОВНАЯ ИНФОРМАЦИЯ ---
        {
          label: 'Основные',
          fields: [
            {
              name: 'name',
              label: 'Наименование',
              type: 'text',
              required: true,
              admin: {
                width: '60%',
              },
            },
            {
              name: 'sku',
              label: 'Артикул',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                width: '40%',
              },
            },
            {
              name: 'shortDescription',
              label: 'Краткое описание',
              type: 'textarea',
              admin: {
                description: 'Появится в карточке товара в общем каталоге.',
              },
            },
            {
              name: 'productCategory',
              type: 'relationship',
              relationTo: 'product-categories',
              required: true,
            },
            {
              name: 'productImage',
              label: 'Главное изображение продукта (миниатюра)',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description:
                  'Это изображение будет использоваться в качестве основного на карточке товара и в каталоге.',
              },
            },
            {
              name: 'images',
              label: 'Галерея изображений',
              type: 'array',
              minRows: 1,
              labels: {
                singular: 'Изображение',
                plural: 'Изображения',
              },
              fields: [
                {
                  name: 'image',
                  label: 'Изображение',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
            { name: 'manufacturer', type: 'relationship', relationTo: 'manufacturers' },
          ],
        },
        // --- ВКЛАДКА 2: ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ ---
        {
          label: 'Характеристики',
          fields: [
            {
              type: 'blocks',
              name: 'layout',
              blocks: [Content, MediaBlock, CallToAction],
            },
          ],
        },
      ],
    },
    ...slugField('sku'),
  ],
}
