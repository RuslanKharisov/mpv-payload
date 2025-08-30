import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

// Определяем тип аргументов
type HomeArgs = {
  heroImage: Media
  metaImage: Media
}

// Указываем тип возвращаемого значения для строгой проверки
export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
}) => {
  return {
    // --- Основные поля коллекции 'pages' ---
    slug: 'home',
    title: 'Главная',
    _status: 'published',
    publishedAt: new Date().toISOString(),

    // --- Вкладка "Hero" ---
    hero: {
      type: 'highImpact',
      links: [],
      media: heroImage.id,
      richText: {
        root: {
          type: 'root',
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'heading',
              tag: 'h1',
              direction: null,
              format: 'center',
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'text',
                  version: 1,
                  text: 'Prom-Stock: Поиск оборудования для АСУ ТП, КИП и А, ПЛК, ЧПУ и других компонентов ....',
                },
              ],
            },
            {
              type: 'paragraph',
              direction: null,
              format: 'center',
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'text',
                  version: 1,
                  text: 'Например: 6ES7315-2AH14-0AB0',
                  format: 'underline',
                },
              ],
            },
          ],
        },
      },
    },

    // --- Вкладка "Content" (Блочный редактор) ---
    layout: [
      // --- БЛОК 1: "Как пользоваться поиском?" и Преимущества ---
      {
        blockType: 'content',
        blockName: 'Content Block',
        columns: [
          {
            size: 'full',
            enableLink: false,
            richText: {
              root: {
                type: 'root',
                direction: null,
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'heading',
                    tag: 'h2',
                    version: 1,
                    children: [{ type: 'text', version: 1, text: 'Как пользоваться поиском?' }],
                  },
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        version: 1,
                        text: 'Для проверки, есть ли в наличе на складе у кого либо оборудование, которое вы ищите, введите в поисковую строку артикул и нажмите на значок поиска. После этого, если оно найдено, быдет выведена карточка компании, а ниже в таблице позиции удовлетворяющие поиску.',
                      },
                    ],
                  },
                ],
              },
            },
          },
          // Колонки для преимуществ
          {
            size: 'oneThird',
            enableLink: false,
            richText: {
              root: {
                type: 'root',
                direction: null,
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'heading',
                    tag: 'h3',
                    version: 1,
                    children: [{ type: 'text', version: 1, text: 'Удобный поиск оборудования' }],
                  },
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        version: 1,
                        text: 'мы делаем сервис удобным и быстрым - каждый день! Оставляйте пожелания и мы их постараемся учесть.',
                      },
                    ],
                  },
                ],
              },
            },
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: {
              root: {
                type: 'root',
                direction: null,
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'heading',
                    tag: 'h3',
                    version: 1,
                    children: [{ type: 'text', version: 1, text: 'Регистрация для поставщиков' }],
                  },
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        version: 1,
                        text: 'регистрируйтесь и загружайте ваши складские позиции.',
                      },
                    ],
                  },
                ],
              },
            },
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: {
              root: {
                type: 'root',
                direction: null,
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'heading',
                    tag: 'h3',
                    version: 1,
                    children: [{ type: 'text', version: 1, text: 'Прямой контакт с поставщиками' }],
                  },
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        version: 1,
                        text: 'связывайтесь с поставщиками и обсуждайте детали напрямую.',
                      },
                    ],
                  },
                ],
              },
            },
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: {
              root: {
                type: 'root',
                direction: null,
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'heading',
                    tag: 'h3',
                    version: 1,
                    children: [{ type: 'text', version: 1, text: 'Растущая база данных' }],
                  },
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        version: 1,
                        text: 'расширяющаяся база данных позволяет находить необходимое оборудование в наличии',
                      },
                    ],
                  },
                ],
              },
            },
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: {
              root: {
                type: 'root',
                direction: null,
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'heading',
                    tag: 'h3',
                    version: 1,
                    children: [{ type: 'text', version: 1, text: 'Экономия времени и ресурсов' }],
                  },
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', version: 1, text: 'всё в одном месте!' }],
                  },
                ],
              },
            },
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: {
              root: {
                type: 'root',
                direction: null,
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'heading',
                    tag: 'h3',
                    version: 1,
                    children: [
                      { type: 'text', version: 1, text: 'Текущая доступность и статус склада' },
                    ],
                  },
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        version: 1,
                        text: 'актуальная информация о наличии товаров на складах поставщиков.',
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
      // --- БЛОК 2: "Популярные продукты" ---
      {
        blockType: 'content',
        blockName: 'Content Block',
        columns: [
          {
            size: 'full',
            enableLink: false,
            richText: {
              root: {
                type: 'root',
                direction: null,
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'heading',
                    tag: 'h2',
                    format: 'center',
                    version: 1,
                    children: [{ type: 'text', version: 1, text: 'Популярные продукты' }],
                  },
                  {
                    type: 'list',
                    listType: 'unordered',
                    start: 1,
                    tag: 'ul',
                    version: 1,
                    children: [
                      {
                        type: 'listitem',
                        version: 1,
                        indent: 0, // <-- ИСПРАВЛЕНО
                        children: [
                          {
                            type: 'link',
                            version: 2,
                            fields: { url: '/stock?sku=6ES7307-1EA01-0AA0', linkType: 'custom' },
                            children: [{ type: 'text', version: 1, text: '6ES7307-1EA01-0AA0' }],
                          },
                        ],
                      },
                      {
                        type: 'listitem',
                        version: 1,
                        indent: 0, // <-- ИСПРАВЛЕНО
                        children: [
                          {
                            type: 'link',
                            version: 2,
                            fields: { url: '/stock?sku=6ES7313-5BE01-0AB0', linkType: 'custom' },
                            children: [{ type: 'text', version: 1, text: '6ES7313-5BE01-0AB0' }],
                          },
                        ],
                      },
                      {
                        type: 'listitem',
                        version: 1,
                        indent: 0, // <-- ИСПРАВЛЕНО
                        children: [
                          {
                            type: 'link',
                            version: 2,
                            fields: { url: '/stock?sku=6ES7313-5BG04-0AB0', linkType: 'custom' },
                            children: [{ type: 'text', version: 1, text: '6ES7313-5BG04-0AB0' }],
                          },
                        ],
                      },
                      // ... Добавьте остальные продукты по этому образцу
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
      // --- БЛОК 3: Статья о сервисе ---
      {
        blockType: 'content',
        blockName: 'Content Block',
        columns: [
          {
            size: 'full',
            enableLink: false,
            richText: {
              root: {
                type: 'root',
                direction: null,
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'heading',
                    tag: 'h2',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        version: 1,
                        text: 'Prom-Stock: Сервис по поиску оборудования для АСУ ТП, КИП и А, Электроприводов и Электрооборудования',
                      },
                    ],
                  },
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        version: 1,
                        text: 'В мире современной промышленности время — это не просто деньги, это критический фактор, определяющий судьбу целых производственных линий, проектов и компаний. Ситуация, знакомая многим специалистам по снабжению и руководителям производств: срочно требуется специфический модуль или деталь, без которой оборудование стоимостью в десятки миллионов рублей простаивает, генерируя колоссальные убытки каждый день.',
                      },
                    ],
                  },
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        version: 1,
                        text: 'Именно для решения таких проблем создан инновационный сервис ',
                      },
                      {
                        type: 'link',
                        version: 2,
                        fields: { url: 'https://prom-stock.ru', linkType: 'custom' },
                        children: [
                          { type: 'text', version: 1, text: 'Prom-Stock.ru', format: 'bold' },
                        ],
                      },
                      {
                        type: 'text',
                        version: 1,
                        text: ' — первая в России площадка, объединяющая владельцев неиспользуемого промышленного оборудования с теми, кто в нем нуждается прямо сейчас.',
                      },
                    ],
                  },
                  {
                    type: 'heading',
                    tag: 'h2',
                    version: 1,
                    children: [{ type: 'text', version: 1, text: 'Преимущества для покупателей' }],
                  },
                  {
                    type: 'list',
                    listType: 'unordered',
                    start: 1,
                    tag: 'ul',
                    version: 1,
                    children: [
                      {
                        type: 'listitem',
                        version: 1,
                        indent: 0, // <-- ИСПРАВЛЕНО
                        children: [
                          { type: 'text', version: 1, text: '⏱ Снижение времени простоя' },
                        ],
                      },
                      {
                        type: 'listitem',
                        version: 1,
                        indent: 0, // <-- ИСПРАВЛЕНО
                        children: [{ type: 'text', version: 1, text: '💸 Экономия бюджета' }],
                      },
                      {
                        type: 'listitem',
                        version: 1,
                        indent: 0, // <-- ИСПРАВЛЕНО
                        children: [
                          {
                            type: 'text',
                            version: 1,
                            text: '🧩 Доступ к снятым с производства моделям',
                          },
                        ],
                      },
                      {
                        type: 'listitem',
                        version: 1,
                        indent: 0, // <-- ИСПРАВЛЕНО
                        children: [{ type: 'text', version: 1, text: '🧭 Профессиональный поиск' }],
                      },
                      {
                        type: 'listitem',
                        version: 1,
                        indent: 0, // <-- ИСПРАВЛЕНО
                        children: [{ type: 'text', version: 1, text: '🤝 Быстрые сделки' }],
                      },
                    ],
                  },
                  {
                    type: 'heading',
                    tag: 'h2',
                    version: 1,
                    children: [{ type: 'text', version: 1, text: 'Заключение' }],
                  },
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', version: 1, text: 'Prom-Stock.ru — это:' }],
                  },
                  {
                    type: 'list',
                    listType: 'unordered',
                    start: 1,
                    tag: 'ul',
                    version: 1,
                    children: [
                      {
                        type: 'listitem',
                        version: 1,
                        indent: 0, // <-- ИСПРАВЛЕНО
                        children: [
                          {
                            type: 'text',
                            version: 1,
                            text: '💡 Новый подход к промышленным закупкам',
                          },
                        ],
                      },
                      {
                        type: 'listitem',
                        version: 1,
                        indent: 0, // <-- ИСПРАВЛЕНО
                        children: [
                          {
                            type: 'text',
                            version: 1,
                            text: '🔄 Экономика повторного использования',
                          },
                        ],
                      },
                      {
                        type: 'listitem',
                        version: 1,
                        indent: 0, // <-- ИСПРАВЛЕНО
                        children: [
                          {
                            type: 'text',
                            version: 1,
                            text: '🚀 Цифровая платформа для быстрого поиска и продажи',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        version: 1,
                        text: 'Prom-Stock — меньше простоев, больше эффективности.',
                        format: 'bold',
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    ],

    // --- Вкладка "SEO" ---
    meta: {
      title: 'Prom-Stock: Поиск оборудования для АСУ ТП, КИП и А, ПЛК, ЧПУ',
      description:
        'Prom-Stock.ru: Быстрый поиск и продажа промышленного оборудования, компонентов АСУ ТП, электроприводов и неликвидов по всей России.',
      image: metaImage.id,
    },
  }
}
