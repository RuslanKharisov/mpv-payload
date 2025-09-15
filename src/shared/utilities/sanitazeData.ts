// 🔒 Общая функция для защиты от XSS (HTML-escape)
export function sanitizeText(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// 📞 Для телефонов — оставляем только цифры, пробелы, +, -, ( )
export function sanitizePhone(input: string): string {
  const safe = input.replace(/[^\d+\-\s()]/g, '')
  return sanitizeText(safe)
}

// 📧 Для email — оставляем буквы, цифры, @, точку, дефис, подчеркивание
export function sanitizeEmail(input: string): string {
  const safe = input.replace(/[^a-zA-Z0-9@._-]/g, '')
  return sanitizeText(safe)
}
