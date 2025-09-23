import { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  access: {
    read: () => true, // Доступно для чтения всем
  },
  fields: [
    {
      name: 'productPlaceholder',
      label: 'Заглушка для товаров',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Это изображение будет показываться, если у товара нет основной картинки.',
      },
    },
  ],
}
