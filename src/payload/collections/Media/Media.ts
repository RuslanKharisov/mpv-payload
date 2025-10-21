import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { isHidden } from '../../access/isHidden'

const WEBP_FORMAT_OPTIONS = {
  format: 'webp',
  options: {
    quality: 85,
  },
} as const

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: { hidden: ({ user }) => !isHidden(user) },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload.
    staticDir: path.resolve(process.cwd(), 'public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        formatOptions: WEBP_FORMAT_OPTIONS,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
        formatOptions: WEBP_FORMAT_OPTIONS,
      },
      {
        name: 'small',
        width: 600,
        formatOptions: WEBP_FORMAT_OPTIONS,
      },
      {
        name: 'medium',
        width: 900,
        formatOptions: WEBP_FORMAT_OPTIONS,
      },
      {
        name: 'large',
        width: 1400,
        formatOptions: WEBP_FORMAT_OPTIONS,
      },
      {
        name: 'xlarge',
        width: 1920,
        formatOptions: WEBP_FORMAT_OPTIONS,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: WEBP_FORMAT_OPTIONS,
      },
    ],
  },
}
