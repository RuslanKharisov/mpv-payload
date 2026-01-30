import type { Block } from 'payload'

export const CategoriesOrBrandsGridBlock: Block = {
  slug: 'categoriesOrBrandsGrid',
  interfaceName: 'CategoriesOrBrandsGridBlock',
  labels: {
    singular: 'Сетка категорий/брендов',
    plural: 'Сетки категорий/брендов',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок секции (опционально)',
      admin: {
        description: 'Отображается над сеткой элементов',
      },
    },
    {
      name: 'mode',
      type: 'radio',
      options: [
        { label: 'Ручной ввод', value: 'manual' },
        { label: 'Из коллекции', value: 'fromCollection' },
      ],
      defaultValue: 'manual',
      admin: {
        layout: 'horizontal',
      },
    },
    // ——— Ручной режим ———
    {
      name: 'manualItems',
      type: 'array',
      label: 'Элементы сетки',
      maxRows: 12,
      admin: {
        condition: (_, { mode }) => mode === 'manual',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Название',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Описание',
          admin: {
            rows: 3,
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Ссылка (относительная)',
          required: true,
          admin: {
            description: 'Пример: /products?category=promyshlennye-pk',
          },
        },
      ],
    },
    // ——— Режим из коллекции ———
    {
      name: 'collection',
      type: 'select',
      label: 'Источник данных',
      admin: {
        condition: (_, { mode }) => mode === 'fromCollection',
      },
      options: [
        { label: 'Категории продуктов', value: 'product-categories' },
        { label: 'Бренды', value: 'brands' },
      ],
      required: true,
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Лимит элементов',
      defaultValue: 9,
      min: 1,
      max: 20,
      admin: {
        condition: (_, { mode }) => mode === 'fromCollection',
        description: 'Максимум 20 элементов',
      },
    },
    // ——— Дополнительно ———
    {
      name: 'columns',
      type: 'select',
      label: 'Колонки на десктопе',
      defaultValue: '3',
      options: [
        { label: '2 колонки', value: '2' },
        { label: '3 колонки', value: '3' },
        { label: '4 колонки', value: '4' },
      ],
    },
  ],
}
