import { useState, useRef } from 'react'
import { Input } from '@/shared/ui/input'
import { findCompanyByInn } from '@/entities/tenant/api/get-company-data-by-inn'
import { DaDataCompanySuggestion } from '@/entities/tenant/_domain/da-data-company-response.dto'
import { ControllerRenderProps } from 'react-hook-form'

type CompanyFieldValue = {
  inn: string
  name: string
  status?: 'ACTIVE' | 'LIQUIDATING' | 'LIQUIDATED' | 'BANKRUPT' | 'REORGANIZING' | null
}

interface InputProps {
  field: ControllerRenderProps<any, 'company'> & {
    value?: CompanyFieldValue
  }
  placeholder?: string
}

const InnInput: React.FC<InputProps> = ({ field, placeholder = 'Начните ввод' }) => {
  const [suggestions, setSuggestions] = useState<DaDataCompanySuggestion[]>([])
  const [onFocus, setOnFocus] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const inn = field.value?.inn || ''

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await findCompanyByInn(query)
      const suggestions = response?.suggestions || []
      setSuggestions(suggestions)
    } catch (error) {
      console.error('Ошибка при поиске ИНН:', error)
      setSuggestions([])
    }
  }

  const handleFocus = () => {
    setOnFocus(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // ПРИ ИЗМЕНЕНИИ: только ИНН обновляем, name оставляем прежним
    field.onChange({
      ...field.value,
      inn: value,
    })

    if (/^\d{10}$/.test(value)) {
      fetchSuggestions(value)
    } else {
      setSuggestions([])
    }
  }

  const handleSelect = (suggestion: DaDataCompanySuggestion) => {
    const name = suggestion.data.name.short_with_opf
    const inn = suggestion.data.inn
    const status = suggestion.data.state?.status ?? null

    // ПРИ ВЫБОРЕ: сразу и inn и name обновляем
    field.onChange({
      inn,
      name,
      status,
    })

    setSuggestions([])
    setOnFocus(false)
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Input
        className="block w-full"
        placeholder={placeholder}
        value={inn}
        onChange={handleChange}
        onFocus={handleFocus}
      />
      {onFocus && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border border-border bg-background shadow-lg">
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className="cursor-pointer px-3 py-2 hover:bg-muted"
              onClick={() => handleSelect(suggestion)}
            >
              <span className="text-sm font-medium">
                {suggestion.data.inn}: {suggestion.value}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default InnInput
