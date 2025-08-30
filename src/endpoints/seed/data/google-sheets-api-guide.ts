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
export type GuideArgs = {
  heroImage: Media
}

export const googleSheetsApiGuide: (args: GuideArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
}) => {
  return {
    // --- Основные поля ---
    slug: 'google-sheets-api-guide',
    title: 'Инструкция по настройке API Google Таблицы',
    _status: 'published',
    publishedAt: new Date('2025-03-01').toISOString(),

    // --- Hero ---
    hero: {
      type: 'highImpact',
      links: [],
      media: heroImage.id, // Можно использовать общее изображение для всех инструкций
      richText: createRichText([
        createHeading('h1', 'Инструкция по настройке API Google Таблицы'),
        createParagraph('Создано: 01.03.2025 | Обновлено: 01.04.2025'),
      ]),
    },

    // --- Основной контент страницы ---
    layout: [
      {
        blockType: 'content',
        blockName: 'Google Sheets API Guide',
        columns: [
          {
            size: 'full',
            enableLink: false,
            richText: createRichText([
              createParagraph(
                'Этот API позволяет подключаться к Google Таблице и получать информацию о товарах по полям sku, description и quantity. Вы можете использовать его для поиска и фильтрации данных по артикулу и описанию.',
              ),
              createParagraph([
                createText('👉 '),
                createLink('https://example.com/google-drive-link', [
                  // Замените на реальную ссылку
                  createText('Ссылка на Google Диск с примером'),
                ]),
              ]),

              createHeading('h2', '🔧 Шаг 1. Подготовьте таблицу'),
              createParagraph(
                'Создайте Google Таблицу (или скопируйте из примера) со следующими столбцами:',
              ),
              createParagraph(
                'sku | description | category | manufacturer | quantity | newdelivery_qty_1 | newdelivery_date_1 | newdelivery_qty_2 | newdelivery_date_2',
              ),
              createParagraph(
                '👉 Минимально обязательные поля: sku, description, quantity. Остальные можно оставить пустыми.',
              ),

              createHeading('h2', '🧠 Шаг 2. Установите скрипт'),
              createList([
                'Откройте вашу Google Таблицу.',
                'В меню выберите: Расширения → Apps Script.',
                'Удалите содержимое и вставьте скрипт из файла api_script.js, доступного по ссылке выше.',
                'Найдите блок конфигурации API_CONFIG и укажите:',
              ]),
              createParagraph(
                // Для блоков кода можно использовать параграфы или создать отдельный хелпер
                `const API_CONFIG = {\n  SECRET_TOKEN: "ваш_секретный_токен", // <-- придумайте секретный пароль\n  SPREADSHEET_ID: "ваш_ID_таблицы", // <-- замените на ваш ID\n  SHEET_NAME: "Лист1",\n  DEFAULT_PER_PAGE: 5,\n  MAX_PER_PAGE: 50,\n  CACHE_DURATION: 300\n};`,
              ),
              createHeading('h3', '🧩 Где взять SPREADSHEET_ID?'),
              createParagraph('Из URL вашей таблицы:'),
              createParagraph(
                'https://docs.google.com/spreadsheets/d/1AbCDeFGhiJKlmNOPqRStuVWxyZ1234567890/edit',
              ),
              createParagraph([
                createText('                                                  после /d/ '),
                createText('вот это', 'bold'),
                createText(' и есть ваш ID'),
              ]),

              createHeading('h2', '🚀 Шаг 3. Разверните как веб-приложение'),
              createList([
                'В Apps Script нажмите Развертывание → Новое развертывание.',
                'В типе развертывания выберите Веб-приложение.',
                'Заполните:\nОписание: API\nКто имеет доступ: Все, включая анонимных\nВыполняется от имени: вас (владельца)',
                'Нажмите Развернуть — скрипт запросит разрешения, подтвердите доступ.',
                'Получите URL веб-приложения — это и будет ваш API URL.',
              ]),

              createHeading('h2', '🔐 Подключение к API'),
              createParagraph(
                'Теперь в личном кабинете во вкладке Профиль, вы раздел Подключение к API можете указать поля:',
              ),
              createList(['API URL', 'Токен доступа']),
              createParagraph('После этого ваши данные будут доступны.'),

              createHeading('h2', '💬 Отладка'),
              createParagraph(
                'Можно протестировать API прямо в Apps Script, вызвав функцию testDoGet() в редакторе скрипта.',
              ),
              createParagraph(
                'Если остались вопросы — откройте пример из Google Диска, там уже всё готово и работает.',
              ),
            ]),
          },
        ],
      },
    ],

    // --- SEO ---
    meta: {
      title: 'Инструкция по настройке API Google Таблицы | Prom-Stock',
      description:
        'Пошаговая инструкция по подключению API Google Sheets для синхронизации товаров с сервисом Prom-Stock.',
    },
  }
}
