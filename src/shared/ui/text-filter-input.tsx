'use client'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { FC } from 'react'
import { SearchIcon } from 'lucide-react'

interface TextFilterInputProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  applyFilter: () => void
  placeholder: string
}

export const TextFilterInput: FC<TextFilterInputProps> = ({
  value,
  onChange,
  applyFilter,
  placeholder,
}) => {
  return (
    <div className="relative w-full">
      <Input
        className="z-20 block h-12 w-full rounded-lg border border-s-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:border-s-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') applyFilter() // Отправляем запрос по Enter
        }}
      />
      <Button
        className="absolute end-0 top-0 h-full rounded-e-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={applyFilter} // Отправляем запрос по кнопке
        variant="ghost"
        title="Применить фильтр"
      >
        <SearchIcon height={20} />
      </Button>
    </div>
  )
}
