import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'size',
      label: 'Размер изображения',
      type: 'select',
      defaultValue: 'medium',
      required: true,
      options: [
        {
          label: 'Маленький (ширина до 600px)',
          value: 'small',
        },
        {
          label: 'Средний (ширина до 900px)',
          value: 'medium',
        },
        {
          label: 'Большой (ширина до 1400px)',
          value: 'large',
        },
        {
          label: 'На всю ширину (до 1920px)',
          value: 'xlarge',
        },
      ],
      admin: {
        description: 'Выберите, как изображение будет вписано в страницу.',
      },
    },
  ],
}
