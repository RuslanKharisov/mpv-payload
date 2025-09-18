import { useState, useEffect } from 'react'

/**
 * Более надежная реализация useDebounce.
 * @param value Значение для дебаунса.
 * @param delay Задержка в миллисекундах.
 * @returns Отложенное значение.
 */
export function useDebounce<T>(value: T, delay = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
