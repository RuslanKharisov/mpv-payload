import type { Block } from 'payload'

export const FeaturesBlock: Block = {
  slug: 'featuresBlock',
  interfaceName: 'FeaturesBlock',
  labels: {
    singular: 'Блок преимуществ',
    plural: 'Блоки преимуществ',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок секции',
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      label: 'Описание секции',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Преимущества',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Заголовок элемента',
        },
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Текст элемента',
        },
        {
          name: 'icon',
          type: 'relationship',
          relationTo: 'icons',
          required: true,
          label: 'Иконка',
        },
      ],
    },
  ],
}
