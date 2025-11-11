export function isValidName(name: string): boolean {
  // Проверка длины
  if (name.length < 2 || name.length > 50) return false

  // Проверка, содержит ли хотя бы одну букву
  const hasLetter = /[a-zA-Zа-яА-ЯёЁ]/.test(name)
  if (!hasLetter) return false

  // 🔒 НОВОЕ: проверка, не сплошная ли это строка из букв (без пробелов, цифр, знаков)
  if (/^[a-zA-Zа-яА-ЯёЁ]+$/.test(name) && name.length > 15) {
    return false
  }

  // 🔒 НОВОЕ: проверка, не все ли заглавные (например, "RANDOMNAME")
  const isAllUppercase = name === name.toUpperCase() && /[A-ZА-ЯЁ]/.test(name)
  if (isAllUppercase && name.length > 5) {
    return false
  }

  // 🔒 НОВОЕ: проверка на чередование регистра (например, "hEVdyCPxeh" — подозрительно)
  // Более 70% заглавных букв — подозрительно
  const upperCount = (name.match(/[A-ZА-ЯЁ]/g) || []).length
  if (upperCount / name.length > 0.7 && name.length > 10) {
    return false
  }

  return true
}
