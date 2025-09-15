/**
 * Преобразует число или строку в строку с пробелами каждые 3 знака
 * @param {T} input - Число или строка для форматирования
 * @returns {string} Отформатированное значение
 */
export function formatNumberWithSpaces<T extends number | string>(input: T): string {
  if (typeof input !== 'number' && typeof input !== 'string') {
    throw new TypeError('Input must be a number or a string')
  }

  // Преобразуем в строку, если это число
  const str = input.toString()

  // Регулярное выражение для добавления пробелов каждые 3 знака
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
