import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'
import {
  createRichText,
  createHeading,
  createParagraph,
  createText,
  createLink,
  createList,
} from '../helpers/helpers' // Убедитесь, что путь к хелперам верный

// Тип аргументов остается без изменений
export type HomeArgs = {
  heroImage: Media
  metaImage: Media
}

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
}) => {
  return {
    // --- Основные поля ---
    slug: 'home',
    title: 'Главная',
    _status: 'published',
    publishedAt: new Date().toISOString(),

    // --- Вкладка "Hero" ---
    hero: {
      type: 'highImpact',
      links: [],
      media: heroImage.id,
      // Вместо огромного JSON - чистые вызовы функций
      richText: createRichText([
        // Для заголовка с особым форматированием, создаем его узел чуть более явно
        {
          ...createHeading(
            'h1',
            'Prom-Stock: Поиск оборудования для АСУ ТП, КИП и А, ПЛК, ЧПУ и других компонентов ....',
          ),
          format: 'center', // Добавляем форматирование
        },
        {
          ...createParagraph(''), // Создаем параграф для центрирования
          format: 'center',
          children: [createText('Например: 6ES7315-2AH14-0AB0', 'underline')],
        },
      ]),
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
            richText: createRichText([
              createHeading('h2', 'Как пользоваться поиском?'),
              createParagraph(
                'Для проверки, есть ли в наличе на складе у кого либо оборудование, которое вы ищите, введите в поисковую строку артикул и нажмите на значок поиска. После этого, если оно найдено, быдет выведена карточка компании, а ниже в таблице позиции удовлетворяющие поиску.',
              ),
            ]),
          },
          // Колонки для преимуществ
          {
            size: 'oneThird',
            enableLink: false,
            richText: createRichText([
              createHeading('h3', 'Удобный поиск оборудования'),
              createParagraph(
                'мы делаем сервис удобным и быстрым - каждый день! Оставляйте пожелания и мы их постараемся учесть.',
              ),
            ]),
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: createRichText([
              createHeading('h3', 'Регистрация для поставщиков'),
              createParagraph('регистрируйтесь и загружайте ваши складские позиции.'),
            ]),
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: createRichText([
              createHeading('h3', 'Прямой контакт с поставщиками'),
              createParagraph('связывайтесь с поставщиками и обсуждайте детали напрямую.'),
            ]),
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: createRichText([
              createHeading('h3', 'Растущая база данных'),
              createParagraph(
                'расширяющаяся база данных позволяет находить необходимое оборудование в наличии',
              ),
            ]),
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: createRichText([
              createHeading('h3', 'Экономия времени и ресурсов'),
              createParagraph('всё в одном месте!'),
            ]),
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: createRichText([
              createHeading('h3', 'Текущая доступность и статус склада'),
              createParagraph('актуальная информация о наличии товаров на складах поставщиков.'),
            ]),
          },
        ],
      },
      // --- БЛОК 2: "Популярные продукты" ---
      {
        blockType: 'content',
        blockName: 'Popular Products',
        columns: [
          {
            size: 'full',
            enableLink: false,
            richText: createRichText([
              { ...createHeading('h2', 'Популярные продукты'), format: 'center' },
              // Для списка со сложным содержимым (ссылками) собираем его вручную,
              // но используя хелперы для внутренних частей.
              {
                type: 'list',
                listType: 'unordered',
                tag: 'ul',
                version: 1,
                children: [
                  {
                    type: 'listitem',
                    version: 1,
                    indent: 0,
                    children: [
                      createLink('/stock?sku=6ES7307-1EA01-0AA0', [
                        createText('6ES7307-1EA01-0AA0'),
                      ]),
                    ],
                  },
                  {
                    type: 'listitem',
                    version: 1,
                    indent: 0,
                    children: [
                      createLink('/stock?sku=6ES7313-5BE01-0AB0', [
                        createText('6ES7313-5BE01-0AB0'),
                      ]),
                    ],
                  },
                  {
                    type: 'listitem',
                    version: 1,
                    indent: 0,
                    children: [
                      createLink('/stock?sku=6ES7313-5BG04-0AB0', [
                        createText('6ES7313-5BG04-0AB0'),
                      ]),
                    ],
                  },
                ],
              },
            ]),
          },
        ],
      },
      // --- БЛОК 3: Статья о сервисе ---
      {
        blockType: 'content',
        blockName: 'About Service',
        columns: [
          {
            size: 'full',
            enableLink: false,
            richText: createRichText([
              createHeading(
                'h2',
                'Prom-Stock: Сервис по поиску оборудования для АСУ ТП, КИП и А, Электроприводов и Электрооборудования',
              ),
              createParagraph(
                'В мире современной промышленности время — это не просто деньги, это критический фактор, определяющий судьбу целых производственных линий, проектов и компаний. Ситуация, знакомая многим специалистам по снабжению и руководителям производств: срочно требуется специфический модуль или деталь, без которой оборудование стоимостью в десятки миллионов рублей простаивает, генерируя колоссальные убытки каждый день.',
              ),
              // Пример параграфа со смешанным контентом (текст, ссылка, текст)
              createParagraph([
                createText('Именно для решения таких проблем создан инновационный сервис '),
                createLink('https://prom-stock.ru', [createText('Prom-Stock.ru', 'bold')]),
                createText(
                  ' — первая в России площадка, объединяющая владельцев неиспользуемого промышленного оборудования с теми, кто в нем нуждается прямо сейчас.',
                ),
              ]),
              createHeading('h2', 'Преимущества для покупателей'),
              createList([
                '⏱ Снижение времени простоя',
                '💸 Экономия бюджета',
                '🧩 Доступ к снятым с производства моделям',
                '🧭 Профессиональный поиск',
                '🤝 Быстрые сделки',
              ]),
              createHeading('h2', 'Заключение'),
              createParagraph('Prom-Stock.ru — это:'),
              createList([
                '💡 Новый подход к промышленным закупкам',
                '🔄 Экономика повторного использования',
                '🚀 Цифровая платформа для быстрого поиска и продажи',
              ]),
              createParagraph([
                createText('Prom-Stock — меньше простоев, больше эффективности.', 'bold'),
              ]),
            ]),
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
