'use client'
import { TextFilterInput } from '@/shared/ui/text-filter-input'
import { cn } from '@/shared/utilities/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Args = {
  className?: string
}

export function SearchInput({ className }: Args) {
  const [searchQueryDraft, setSearchQueryDraft] = useState<string>('') // Для чернового ввода
  const router = useRouter()

  const handleSearchChange = (newSearchQuery: string) => {
    setSearchQueryDraft(newSearchQuery) // Обновляем черновой фильтр
  }

  const applyFilters = () => {
    if (searchQueryDraft.trim()) {
      router.push(`products?phrase=${encodeURIComponent(searchQueryDraft)}`)
    }
  }

  const handleExampleClick = (exampleSku: string) => {
    setSearchQueryDraft(exampleSku) // Устанавливаем значение в инпут
    router.push(`products?phrase=${encodeURIComponent(exampleSku)}`) // Переходим по ссылке
  }

  return (
    <div className={cn('w-full py-5', className)}>
      <TextFilterInput
        value={searchQueryDraft}
        onChange={(e) => handleSearchChange(e.target.value)}
        applyFilter={applyFilters} // Применяем фильтр
        placeholder="Искать ..."
      />
      <p
        className="mt-1 cursor-pointer text-lg font-bold text-white underline"
        onClick={() => handleExampleClick('6ES7')}
      >
        Например: 6ES7315-2AH14-0AB0
      </p>
    </div>
  )
}
