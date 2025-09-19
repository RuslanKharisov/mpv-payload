'use client'
import { TextFilterInput } from '@/shared/ui/text-filter-input'
import { cn } from '@/shared/utilities/ui'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type Args = {
  className?: string
  currentPhrase?: string
}

export function SearchInput({ className, currentPhrase }: Args) {
  const [searchQueryDraft, setSearchQueryDraft] = useState<string>(currentPhrase || '')

  const router = useRouter()
  const searchParams = useSearchParams()

  // Создаем общую функцию для обновления URL
  const updateUrlWithPhrase = (phrase: string) => {
    // Копирует все существующие параметры (category, brands и т.д.)
    const params = new URLSearchParams(searchParams.toString())

    // Устанавливает или удаляет параметр 'phrase'
    const trimmedPhrase = phrase.trim()
    if (trimmedPhrase) {
      params.set('phrase', trimmedPhrase)
    } else {
      params.delete('phrase')
    }

    params.delete('page')

    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  const handleSearchChange = (newSearchQuery: string) => {
    setSearchQueryDraft(newSearchQuery)
  }

  const applyFilters = () => {
    updateUrlWithPhrase(searchQueryDraft)
  }

  const handleExampleClick = (exampleSku: string) => {
    setSearchQueryDraft(exampleSku)
    updateUrlWithPhrase(exampleSku)
  }

  return (
    <div className={cn('w-full py-5', className)}>
      <TextFilterInput
        value={searchQueryDraft}
        onChange={(e) => handleSearchChange(e.target.value)}
        applyFilter={applyFilters}
        placeholder="Искать ..."
      />
      <p
        className="mt-1 cursor-pointer text-lg font-bold text-white underline"
        onClick={() => handleExampleClick('6ES7')}
      >
        Например: 6ES7
      </p>
    </div>
  )
}
