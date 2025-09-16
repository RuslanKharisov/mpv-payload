import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { CollectionConfig } from 'payload'
import { anyone } from '@/payload/access/anyone'
import { checkTenantFeatureAccess } from '@/payload/access/hasActiveFeature'
import { authenticated } from '@/payload/access/authenticated'

export const CompanyPosts: CollectionConfig = {
  slug: 'company-posts',
  labels: { singular: 'Пост компании', plural: 'Посты компании' },
  access: {
    create: checkTenantFeatureAccess('CAN_CREATE_POSTS'),
    read: anyone,
    update: authenticated, // Обновлять может админ тенанта или автор
    delete: authenticated,
  },
  admin: { useAsTitle: 'title', group: 'Продвижение' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      label: false,
      required: true,
    },
  ],
}
