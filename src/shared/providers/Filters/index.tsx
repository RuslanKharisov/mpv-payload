'use client'

import { createContext, useContext, useMemo } from 'react'
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
  setFilter: (key: keyof Filters, value: string | string[] | number | undefined) => void
  resetFilters: () => void
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filters = useMemo<Filters>(() => {
    const next: Filters = {}

    const brands = searchParams.get('brands')
    if (brands) next.brands = brands.split(',')

    const city = searchParams.get('city')
    if (city) next.city = city

    const category = searchParams.get('category')
    if (category) next.category = category

    const region = searchParams.get('region')
    if (region) next.region = region

    const phrase = searchParams.get('phrase')
    if (phrase) next.phrase = phrase

    const page = searchParams.get('page')
    if (page) next.page = Number(page) || 1

    const condition = searchParams.get('condition')
    if (condition) next.condition = condition

    return next
  }, [searchParams])

  const setFilter = (key: keyof Filters, value: string | string[] | number | undefined) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === undefined || (Array.isArray(value) && value.length === 0)) {
      params.delete(key)
    } else {
      params.set(key, Array.isArray(value) ? value.join(',') : String(value))
    }

    // Удаляем page при изменении фильтра
    if (key !== 'page') params.delete('page')

    const url = `/products?${params.toString()}`
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
