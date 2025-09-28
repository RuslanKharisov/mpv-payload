import type { Block } from 'payload'

export const PromotedProducts: Block = {
  slug: 'promotedProducts',
  interfaceName: 'PromotedProductsBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок блока',
      defaultValue: 'Рекомендуемые товары',
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Количество товаров для показа',
      defaultValue: 8,
      admin: {
        description: 'Сколько товаров будет отображаться в карусели.',
        step: 1,
      },
    },
  ],
}
