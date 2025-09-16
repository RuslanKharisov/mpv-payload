import { Payload } from 'payload'

export const seedGlobal = async (payload: Payload) => {
  payload.logger.info('--- Заполнение глобальных данных ---')

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          { link: { type: 'custom', label: 'Главная', url: '/' } },
          { link: { type: 'custom', label: 'Каталог', url: '/products' } },
          { link: { type: 'custom', label: 'Категории', url: '/product-categories' } },
          { link: { type: 'custom', label: 'Блог', url: '/posts' } },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [
          {
            link: { type: 'custom', label: 'Политика конфиденциальности', url: '/privacy-policy' },
          },
          {
            link: { type: 'custom', label: 'Пользовательское соглашение', url: '/user-agreement' },
          },
          {
            link: { type: 'custom', label: 'Правила использования', url: '/terms-of-use' },
          },
          {
            link: { type: 'custom', label: 'API Google Таблицы', url: '/google-sheets-api-guide' },
          },
        ],
      },
    }),
  ])
}
