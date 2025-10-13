'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Filters = {
  brands?: string[]
  city?: string
  region?: string
  phrase?: string
  page?: number
  condition?: string
  category?: string
}

type FiltersContextType = {
  filters: Filters
  setFilter: (key: keyof Filters, value: any) => void
  resetFilters: () => void
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

export function FiltersProvider({
  children,
  initialFilters,
}: {
  children: React.ReactNode
  initialFilters: Record<string, any>
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<Filters>({})

  useEffect(() => {
    const newFilters: Filters = {}
    if (searchParams.get('brands')) newFilters.brands = searchParams.get('brands')?.split(',') || []
    if (searchParams.get('city')) newFilters.city = searchParams.get('city') || undefined
    if (searchParams.get('category'))
      newFilters.category = searchParams.get('category') || undefined
    if (searchParams.get('region')) newFilters.region = searchParams.get('region') || undefined
    if (searchParams.get('phrase')) newFilters.phrase = searchParams.get('phrase') || undefined
    if (searchParams.get('page')) newFilters.page = Number(searchParams.get('page')) || 1
    if (searchParams.get('condition'))
      newFilters.condition = searchParams.get('condition') || undefined

    setFilters(newFilters)
  }, [searchParams])

  const setFilter = (key: keyof Filters, value: any) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === undefined || (Array.isArray(value) && value.length === 0)) {
      params.delete(key)
    } else {
      params.set(key, Array.isArray(value) ? value.join(',') : String(value))
    }

    // Удаляем page при изменении фильтра
    if (key !== 'page') params.delete('page')

    const url = `/products?${params.toString()}`
    console.log('Navigating to:', url)
    router.push(url, { scroll: false })
  }

  const resetFilters = () => {
    router.push('/products', { scroll: false })
  }

  return (
    <FiltersContext.Provider value={{ filters, setFilter, resetFilters }}>
      {children}
    </FiltersContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FiltersContext)
  if (!context) throw new Error('useFilters must be used within FiltersProvider')
  return context
}
