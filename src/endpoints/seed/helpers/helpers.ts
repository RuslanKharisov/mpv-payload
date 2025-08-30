/**
 * @file Вспомогательные функции для генерации JSON-структуры Lexical редактора.
 * Эти хелперы упрощают создание seed-файлов для полей richText.
 */

/**
 * **ИСПРАВЛЕННЫЙ ТИП**
 * Базовый тип для любого узла Lexical.
 * Теперь он ТРЕБУЕТ наличия полей `type` и `version`, что соответствует ожиданиям Payload.
 * Индексная подпись `[key: string]: any` по-прежнему позволяет добавлять любые другие специфичные для узла свойства.
 */
interface LexicalNode {
  type: string
  version: number
  [key: string]: any
}

/**
 * Тип, описывающий структуру объекта, который ожидает Payload для поля richText.
 */
type LexicalRichText = {
  root: {
    type: 'root'
    direction: ('ltr' | 'rtl') | null
    format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
    indent: number
    version: number
    children: LexicalNode[]
  }
}

/**
 * Создает текстовый узел (самая базовая единица контента).
 * @param text - Отображаемый текст.
 * @param format - Необязательный формат текста ('bold', 'italic', 'underline' и т.д.).
 * @returns {LexicalNode} - Объект текстового узла Lexical.
 */
export const createText = (text: string, format?: string): LexicalNode => ({
  type: 'text',
  version: 1,
  text,
  ...(format && { format }),
})

/**
 * Создает узел ссылки.
 * @param url - URL-адрес ссылки.
 * @param children - Массив дочерних узлов (обычно один текстовый узел).
 * @returns {LexicalNode} - Объект узла ссылки Lexical.
 */
export const createLink = (url: string, children: LexicalNode[]): LexicalNode => ({
  type: 'link',
  version: 2,
  fields: {
    url,
    linkType: 'custom',
  },
  children,
})

/**
 * Создает узел параграфа.
 * @param children - Либо простая строка, либо массив дочерних узлов.
 * @returns {LexicalNode} - Объект узла параграфа Lexical.
 */
export const createParagraph = (children: string | LexicalNode[]): LexicalNode => ({
  type: 'paragraph',
  version: 1,
  children: Array.isArray(children) ? children : [createText(children)],
})

/**
 * Создает узел заголовка.
 * @param tag - HTML-тег заголовка ('h1', 'h2', 'h3').
 * @param text - Текст заголовка.
 * @returns {LexicalNode} - Объект узла заголовка Lexical.
 */
export const createHeading = (tag: 'h1' | 'h2' | 'h3', text: string): LexicalNode => ({
  type: 'heading',
  tag,
  version: 1,
  children: [createText(text)],
})

/**
 * Создает узел списка.
 * @param items - Массив строк, где каждая строка - это элемент списка.
 * @param listType - Тип списка: 'unordered' (маркированный) или 'ordered' (нумерованный).
 * @returns {LexicalNode} - Объект узла списка Lexical.
 */
export const createList = (
  items: string[],
  listType: 'unordered' | 'ordered' = 'unordered',
): LexicalNode => ({
  type: 'list',
  listType,
  tag: listType === 'unordered' ? 'ul' : 'ol',
  version: 1,
  children: items.map((item) => ({
    type: 'listitem',
    version: 1,
    indent: 0,
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [createText(item)],
      },
    ],
  })),
})

/**
 * Создает корневой объект для поля richText.
 * Эта функция является оберткой для всего контента.
 * @param children - Массив узлов верхнего уровня (параграфы, заголовки, списки).
 * @returns {LexicalRichText} - Возвращает конкретный тип LexicalRichText.
 */
export const createRichText = (children: LexicalNode[]): LexicalRichText => ({
  root: {
    type: 'root',
    direction: null,
    format: '',
    indent: 0,
    version: 1,
    children,
  },
})
