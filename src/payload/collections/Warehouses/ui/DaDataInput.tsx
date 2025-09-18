'use client'
import { useDebounce } from '@/shared/utilities/useDebounce'
import React, { useEffect, useState } from 'react'
import './index.scss'

type DaDataInputProps = {
  onSelect: (suggestion: any) => void // Изменили тип для ясности
  initialValue?: string
}

export function DaDataInput({ onSelect, initialValue }: DaDataInputProps) {
  const [inputValue, setInputValue] = useState(initialValue || '')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const debouncedValue = useDebounce(inputValue, 500)

  useEffect(() => {
    // Запрашиваем подсказки только если введено 3+ символа, и поле в фокусе
    if (debouncedValue?.length >= 3 && isFocused) {
      const fetchData = async () => {
        const response = await fetchSuggestions(debouncedValue)
        setSuggestions(response.suggestions || [])
      }
      fetchData()
    } else {
      setSuggestions([])
    }
  }, [debouncedValue, isFocused])

  const handleSelectSuggestion = (suggestion: any) => {
    setIsFocused(false)
    setInputValue(suggestion.value)
    setSuggestions([])
    onSelect(suggestion) // <-- РАСКОММЕНТИРОВАЛИ И ПЕРЕДАЕМ ВЕСЬ ОБЪЕКТ
  }

  return (
    <div className="relative w-full">
      <label htmlFor="adress__find-input">
        Введите ваш адрес и выберите для сохранения в поле ниже.
      </label>
      <input
        className="field__castom--input"
        id="adress__find-input"
        data-slot="input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        // Скрываем список при потере фокуса, с небольшой задержкой, чтобы успел сработать onClick
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
      />

      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full border border-border bg-background shadow-lg mt-1 rounded-md">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="cursor-pointer p-2 hover:bg-foreground/10"
              onClick={() => handleSelectSuggestion(s)}
            >
              {s.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

async function fetchSuggestions(query: string): Promise<{ suggestions: any[] }> {
  const res = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${process.env.NEXT_PUBLIC_DADATA_API_KEY}`,
    },
    body: JSON.stringify({ query, count: 10 }),
  })
  return res.json()
}
