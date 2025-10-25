import { useMemo } from 'react'
import { useTRPC } from '@/shared/trpc/client'
import { useQuery } from '@tanstack/react-query'

/**
 * Hook to get product count by brand ID
 */
export function useProductCountByBrand(brandId: number) {
  const trpc = useTRPC()

  const queryOptions = useMemo(() => {
    return trpc?.products.countByBrandId.queryOptions({
      brandId: brandId || 0,
    })
  }, [trpc, brandId])

  const { data } = useQuery(queryOptions)
  return data?.totalDocs || 0
}

/**
 * Hook to get product count by category ID
 */
export function useProductCountByCategory(categoryId: number) {
  const trpc = useTRPC()

  const queryOptions = useMemo(() => {
    return trpc?.products.countByCategoryAndChildrenIds.queryOptions({
      categoryId: categoryId || 0,
    })
  }, [trpc, categoryId])

  const { data } = useQuery(queryOptions)
  return data?.totalDocs || 0
}

/**
 * Hook to get product count by condition
 */
export function useProductCountByCondition(condition: string) {
  const trpc = useTRPC()

  const queryOptions = useMemo(() => {
    return trpc?.products.countByCondition.queryOptions({
      condition: condition || '',
    })
  }, [trpc, condition])

  const { data } = useQuery(queryOptions)
  return data?.totalDocs || 0
}

/**
 * Hook to get product count by region
 */
export function useProductCountByRegion(region: string) {
  const trpc = useTRPC()

  const queryOptions = useMemo(() => {
    return trpc?.products.countByRegion.queryOptions({
      region: region || '',
    })
  }, [trpc, region])

  const { data } = useQuery(queryOptions)
  return data?.totalDocs || 0
}

/**
 * Hook to get product count by city
 */
export function useProductCountByCity(city: string) {
  const trpc = useTRPC()

  const queryOptions = useMemo(() => {
    return trpc?.products.countByCity.queryOptions({
      city: city || '',
    })
  }, [trpc, city])

  const { data } = useQuery(queryOptions)
  return data?.totalDocs || 0
}
