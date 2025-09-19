/**
 * Форматирует число или строку в денежный формат с указанием валюты.
 * Использует Intl.NumberFormat для корректного отображения в зависимости от локали.
 *
 * @template T - Тип может быть числом или строкой.
 * @param {T} amount - Число или строка для форматирования.
 * @param {string} currencyCode - Трехбуквенный код валюты (например, 'RUB', 'USD', 'EUR').
 * @param {string} [locale='ru-RU'] - Строка с языковым тегом BCP 47 (например, 'ru-RU', 'en-US').
 * @returns {string} Отформатированная денежная строка.
 */
export function formatCurrency<T extends number | string>(
  amount: T,
  currencyCode: string,
  locale: string = 'ru-RU', // Добавлен необязательный параметр локали
): string {
  // 1. Проверка типа входных данных, как в примере
  if (typeof amount !== 'number' && typeof amount !== 'string') {
    throw new TypeError("Входное значение 'amount' должно быть числом или строкой")
  }

  // 2. Преобразуем в число, так как Intl.NumberFormat требует число
  const numericAmount = Number(amount)

  // Дополнительная проверка, что строковое значение успешно преобразовалось в число
  if (isNaN(numericAmount)) {
    throw new TypeError("Строковое значение 'amount' не может быть преобразовано в число")
  }

  // 3. Используем Intl.NumberFormat для форматирования
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(numericAmount)
}
