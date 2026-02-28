import { DaDataCompanySuggestion } from '@/entities/tenant/_domain/da-data-company-response.dto'
import { useTRPC } from '@/shared/trpc/client'
import { Input } from '@/shared/ui/input'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
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
  const [onFocus, setOnFocus] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const trpc = useTRPC()

  const inn = field.value?.inn || ''

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setOnFocus(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  const getCompanyByInnQueryOptions = trpc.tenants.getCompanyByInn.queryOptions(
    { inn },
    {
      enabled: !!inn && inn.length >= 10,
    },
  )

  const { data } = useQuery({
    ...getCompanyByInnQueryOptions,
    placeholderData: (prev) => prev,
  })

  const suggestions = data?.suggestions ?? []

  const handleFocus = () => {
    setOnFocus(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    field.onChange({
      ...field.value,
      inn: value,
    })
    // react-query сам перезапросит по inn, fetchSuggestions больше не нужен
  }

  const handleSelect = (suggestion: DaDataCompanySuggestion) => {
    const name = suggestion.data.name.short_with_opf
    const inn = suggestion.data.inn
    const status = suggestion.data.state?.status ?? null

    field.onChange({
      inn,
      name,
      status,
    })

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
              key={suggestion.data.inn + idx}
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
