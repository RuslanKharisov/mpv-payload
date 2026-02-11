import { useMemo } from 'react'
import { useTRPC } from '@/shared/trpc/client'
import { useQuery } from '@tanstack/react-query'

export function useAllFilterStats() {
  const trpc = useTRPC()

  const queryOptions = useMemo(() => trpc.products.getFilterStats.queryOptions(), [trpc])

  const { data, isLoading } = useQuery({
    ...queryOptions,
    staleTime: 5 * 60 * 1000,
  })

  return {
    stats: data || { conditions: {}, cities: {}, regions: {} },
    isLoading,
  }
}
