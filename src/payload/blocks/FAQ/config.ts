import type { Block } from 'payload'
import {
  AlignFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

export const FAQBlock: Block = {
  slug: 'faqBlock',
  interfaceName: 'FAQBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок секции',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 2,
      label: 'Вопросы и ответы',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          label: 'Вопрос',
        },
        {
          name: 'answer',
          type: 'richText',
          label: 'Ответ',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h4', 'h5'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
              AlignFeature(),
              UnorderedListFeature(),
              OrderedListFeature(),
              LinkFeature(),
            ],
          }),
        },
      ],
    },
  ],
}
