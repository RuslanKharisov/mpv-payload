import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'
import {
  createRichText,
  createHeading,
  createParagraph,
  createList,
  createText,
  createLink,
} from '../helpers/helpers'

// Определяем тип аргументов для этой страницы
export type AgreementArgs = {
  heroImage: Media
}

export const userAgreement: (args: AgreementArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
}) => {
  return {
    // --- Основные поля ---
    slug: 'user-agreement',
    title: 'Пользовательское соглашение',
    _status: 'published',
    publishedAt: new Date('2025-03-01').toISOString(),

    // --- Hero ---
    hero: {
      type: 'lowImpact',
      links: [],
      media: heroImage.id,
      richText: createRichText([
        createHeading('h1', 'Пользовательское соглашение'),
        createParagraph('Создано: 01.03.2025'),
      ]),
    },

    // --- Основной контент страницы ---
    layout: [
      {
        blockType: 'content',
        blockName: 'User Agreement Content',
        columns: [
          {
            size: 'full',
            enableLink: false,
            richText: createRichText([
              createParagraph(
                'Индивидуальный предприниматель Харисов Руслан Ринатович, именуемый в дальнейшем «Prom-Stock», с одной стороны, и',
              ),
              createParagraph(
                'Любое физическое или юридическое лицо, именуемое в дальнейшем «Пользователь»,',
              ),
              createParagraph(
                'при совместном упоминании именуемые «Стороны», а по отдельности — «Сторона»,',
              ),
              createParagraph('заключили настоящее Пользовательское соглашение о нижеследующем:'),

              createHeading('h3', 'Термины и определения'),
              createParagraph(
                'Термины и определения, применяемые в настоящем Пользовательском соглашении, имеют значение, указанное в Правилах Prom-Stock.',
              ),

              createHeading('h2', '1. Предмет соглашения'),
              createHeading('h3', '1.1. Общие положения'),
              createParagraph(
                'Prom-Stock предоставляет Пользователю доступ к Сайту и Сервису для получения платных и бесплатных услуг, указанных на Сайте.',
              ),
              createHeading('h3', '1.2. Порядок акцепта'),
              createList([
                'Соглашение является офертой в соответствии со ст. 435 ГК РФ',
                'Акцепт совершается при регистрации на Сайте',
                'Дата заключения фиксируется автоматически',
              ]),
              createHeading('h3', '1.3. Сопутствующие документы'),
              createParagraph('При заключении Соглашения Пользователь принимает:'),
              createList(['Правила использования Сайта', 'Политику конфиденциальности']),
              // ... и так далее для всех разделов ...

              createHeading('h2', '7. Заключительные положения'),
              createHeading('h3', '7.1. Порядок разрешения споров'),
              createList([
                'Переговоры',
                'Претензионный порядок (30 дней)',
                'Судебное разбирательство',
              ]),
              createHeading('h3', '7.2. Юридическая сила документов'),
              createParagraph('Официальные контакты для переписки:'),
              createList([
                'Prom-Stock: client@prom-stock.ru',
                'Пользователь: email, указанный при регистрации',
              ]),
              createHeading('h3', 'Реквизиты Prom-Stock:'),
              createParagraph('ИП Харисов Руслан Ринатович'),
              createParagraph('ИНН 165106593664 | ОГРН 322169000051871'),
              createParagraph('р/с 40802810500003111884 в АО "ТИНЬКОФФ БАНК"'),
              createParagraph('БИК 044525974 | к/с 30101810145250000974'),

              createParagraph('Актуальная версия документа'),
            ]),
          },
        ],
      },
    ],

    // --- SEO ---
    meta: {
      title: 'Пользовательское соглашение | Prom-Stock',
      description:
        'Официальное пользовательское соглашение сервиса Prom-Stock. Условия предоставления услуг и лицензионные права.',
    },
  }
}
