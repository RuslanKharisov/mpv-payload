import { anyone } from '@/payload/access/anyone'
import { authenticated } from '@/payload/access/authenticated'
import { isHidden } from '@/payload/access/isHidden'
import { isSuperAdminAccess } from '@/payload/access/isSuperAdmin'
import { CallToAction } from '@/payload/blocks/CallToAction/config'
import { Content } from '@/payload/blocks/Content/config'
import { MediaBlock } from '@/payload/blocks/MediaBlock/config'
import { skuNormalizedField } from '@/payload/fields/skuNormalized/skuNormalizedField'
import { slugField } from '@/payload/fields/slug'
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
    plural: 'Каталог продуктов',
  },
  admin: {
    // hidden: ({ user }) => !isHidden(user),
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
            {
              name: 'brand',
              label: 'Производитель',
              type: 'relationship',
              relationTo: 'brands',
            },
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
    skuNormalizedField('sku'),
  ],
}
