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
          { link: { type: 'custom', label: 'Admin', url: '/admin' } },
          // { link: { type: 'reference', label: 'Contact', reference: { relationTo: 'pages', value: contactPage.id } } },
        ],
      },
    }),
  ])
}
