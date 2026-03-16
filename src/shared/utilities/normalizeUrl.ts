/**
 * Нормализует произвольную строку URL:
 * - если нет схемы — добавляет https://
 * - возвращает полностью собранный URL (href)
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim()

  if (!trimmed) {
    throw new Error('Empty URL')
  }

  const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
  const withScheme = hasScheme ? trimmed : `https://${trimmed}`

  const urlObj = new URL(withScheme)
  return urlObj.toString()
}

/**
 * Достаёт hostname из произвольной строки URL (схема может быть/не быть).
 * Пример: "https://nppgks.com/" или "nppgks.com" → "nppgks.com"
 */
export function extractHostname(rawUrl: string): string {
  const normalized = normalizeUrl(rawUrl)
  const urlObj = new URL(normalized)
  return urlObj.hostname.toLowerCase()
}
