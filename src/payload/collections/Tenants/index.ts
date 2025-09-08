import { anyone } from '@/payload/access/anyone'
import { authenticated } from '@/payload/access/authenticated'
import { isSuperAdminAccess } from '@/payload/access/isSuperAdmin'
import { Archive } from '@/payload/blocks/ArchiveBlock/config'
import { CallToAction } from '@/payload/blocks/CallToAction/config'
import { Content } from '@/payload/blocks/Content/config'
import { FormBlock } from '@/payload/blocks/Form/config'
import { MediaBlock } from '@/payload/blocks/MediaBlock/config'
import { slugField } from '@/payload/fields/slug'
import { hero } from '@/payload/heros/config'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: isSuperAdminAccess,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Компания и аккаунт',
  },
  labels: {
    singular: 'Профиль_Компании',
    plural: 'Профиль_Компании',
  },
  fields: [
    ...slugField('name'),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основное',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Компания',
              admin: {
                description: 'Название компании или организации (например, OnStock)',
              },
            },
            {
              name: 'domain',
              type: 'text',
              admin: {
                description:
                  'Используется для определения домена, к которому относится этот тенант. Например: onstock.ru',
              },
            },
            // {
            //   name: 'slug',
            //   type: 'text',
            //   index: true,
            //   required: true,
            //   unique: true,
            //   admin: {
            //     description: 'Идентификатор для использования в URL. Например: [slug].onstock',
            //   },
            // },
            {
              name: 'allowPublicRead',
              type: 'checkbox',
              admin: {
                description:
                  'Если отмечено, пользователи смогут просматривать данные этого тенанта без авторизации.',
                position: 'sidebar',
              },
              defaultValue: false,
              index: true,
            },
            {
              name: 'accountDetailsSubmitted',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                readOnly: true,
                description:
                  'Вы не можете создавать продукты, пока не получено подтверждение данных аккаунта.',
              },
            },
          ],
        },
        {
          label: 'API настройки',
          fields: [
            {
              name: 'apiUrl',
              type: 'text',
              label: 'API URL',
              admin: {
                description: 'Адрес API поставщика (например: https://sheets.googleapis.com/...)',
              },
            },
            {
              name: 'apiToken',
              type: 'text',
              label: 'API Token',
              admin: {
                description: 'Токен авторизации для обращения к API',
              },
            },
            {
              name: 'apiType',
              type: 'select',
              label: 'Тип API',
              options: [
                { label: 'Google Sheets', value: 'google' },
                { label: 'ERP', value: 'erp' },
                { label: 'Custom', value: 'custom' },
              ],
            },
          ],
        },
        {
          label: 'Страница компании',
          fields: [
            // hero,
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock],
              admin: {
                initCollapsed: true,
              },
            },
            {
              name: 'meta',
              label: 'SEO',
              type: 'group',
              fields: [
                OverviewField({
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                  imagePath: 'meta.image',
                }),
                MetaTitleField({ hasGenerateFn: true }),
                MetaImageField({ relationTo: 'media' }),
                MetaDescriptionField({}),
                PreviewField({
                  hasGenerateFn: true,
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
}
