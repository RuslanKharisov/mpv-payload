import type { Block } from 'payload'
import {
  HeadingFeature,
  lexicalEditor,
  LinkFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

export const TimelineBlock: Block = {
  slug: 'timelineBlock',
  interfaceName: 'TimelineBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок секции',
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 2,
      label: 'Шаги',
      fields: [
        {
          name: 'stepTitle',
          type: 'text',
          required: true,
          label: 'Заголовок шага',
        },
        {
          name: 'stepDescription',
          type: 'richText',
          label: 'Описание шага',
          editor: lexicalEditor({
            features: () => [
              HeadingFeature({ enabledHeadingSizes: ['h4', 'h5'] }),
              UnorderedListFeature(),
              LinkFeature(),
            ],
          }),
        },
      ],
    },
  ],
}
