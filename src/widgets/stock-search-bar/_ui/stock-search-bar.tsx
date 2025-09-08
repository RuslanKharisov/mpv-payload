'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Spinner } from '@/shared/ui/spinner'
import { TextFilterInput } from '@/shared/ui/text-filter-input'

export function StockSearchBar() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [filters, setFilters] = useState({
    sku: searchParams.get('sku') || '',
    description: searchParams.get('description') || '',
  })

  const handleChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    console.log('params ==> ', params)

    if (filters.sku) params.set('sku', filters.sku)
    else params.delete('sku')

    if (filters.description) params.set('description', filters.description)
    else params.delete('description')

    const perPage = searchParams.get('perPage') || '5'
    params.set('perPage', perPage)

    params.set('page', '1')

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row">
      <TextFilterInput
        value={filters.sku}
        onChange={(e) => handleChange('sku', e.target.value)}
        applyFilter={applyFilters}
        placeholder="Искать по артикулу..."
      />
      <TextFilterInput
        value={filters.description}
        onChange={(e) => handleChange('description', e.target.value)}
        applyFilter={applyFilters}
        placeholder="Искать по описанию..."
      />

      {isPending && <Spinner className="w-fit" />}
    </div>
  )
}
