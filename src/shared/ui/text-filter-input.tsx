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
        className="z-20 block h-12 w-full "
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') applyFilter() // Отправляем запрос по Enter
        }}
      />
      <Button
        className="absolute end-0 top-0 h-full rounded-e-lg border cursor-pointer px-5! hover:text-destructive hover:bg-transparent"
        onClick={applyFilter} // Отправляем запрос по кнопке
        variant="ghost"
        title="Применить фильтр"
      >
        <SearchIcon height={20} />
      </Button>
    </div>
  )
}
