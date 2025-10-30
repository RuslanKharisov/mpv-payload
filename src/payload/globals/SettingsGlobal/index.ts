// src/payload/globals/SettingsGlobal/index.ts
import { GlobalConfig } from 'payload'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { isSuperAdmin } from '@/payload/access/isSuperAdmin'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  access: {
    read: () => true, // Доступно для чтения всем
  },
  admin: {
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  fields: [
    {
      name: 'productPlaceholder',
      label: 'Заг-лушка для товаров',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Это изображение будет показываться, если у товара нет основной картинки.',
      },
    },

    // ✅ Оборачиваем все SEO-поля в одну группу 'meta'
    {
      name: 'meta',
      label: 'SEO Настройки по умолчанию',
      type: 'group',
      fields: [
        OverviewField({
          // Пути теперь более простые, так как они находятся внутри группы 'meta'
          titlePath: 'title',
          descriptionPath: 'description',
          imagePath: 'image',
        }),
        MetaTitleField({
          hasGenerateFn: true,
        }),
        MetaImageField({
          relationTo: 'media',
        }),
        MetaDescriptionField({}),
        PreviewField({
          hasGenerateFn: true,
          titlePath: 'title',
          descriptionPath: 'description',
        }),
      ],
    },
  ],
}
