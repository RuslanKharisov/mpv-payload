import { useMemo } from 'react'
import { useTRPC } from '@/shared/trpc/client'
import { useQuery } from '@tanstack/react-query'

/**
 * Хук для получения количества продуктов по массиву ID брендов
 */
export function useProductCountsByBrands(brandIds: number[]) {
  const trpc = useTRPC()
  const enabled = brandIds.length > 0 && brandIds.every((id) => id > 0)

  const queryOptions = useMemo(
    () => trpc.products.countByBrandIds.queryOptions({ brandIds }),
    [trpc, brandIds],
  )

  const { data } = useQuery({
    ...queryOptions,
    enabled,
    staleTime: 5 * 60 * 1000,
  })
  return data || {}
}

/**
 * Хук для получения количества продуктов по массиву ID категорий вместе с их дочерними категориями
 */
export function useProductCountsByCategories(categoryIds: number[]) {
  const trpc = useTRPC()

  const enabled = categoryIds.length > 0 && categoryIds.every((id) => id > 0)

  const queryOptions = useMemo(
    () => trpc?.products.countByCategoryAndChildrenIdsBulk.queryOptions({ categoryIds }),
    [trpc, categoryIds],
  )

  const { data } = useQuery({
    ...queryOptions,
    enabled,
    staleTime: 5 * 60 * 1000,
  })
  return data || {}
}

/**
 * Хук для получения количества продуктов по массиву состяния товара (conditions)
 */
export function useProductCountsByConditions(conditions: string[]) {
  const trpc = useTRPC()

  const enabled = conditions.length > 0

  const queryOptions = useMemo(
    () => trpc?.products.countByConditions.queryOptions({ conditions }),
    [trpc, conditions],
  )

  const { data } = useQuery({
    ...queryOptions,
    enabled,
    staleTime: 5 * 60 * 1000,
  })
  return data || {}
}

/**
 * Хук для получения количества продуктов по массиву регионов (regions)
 */
export function useProductCountsByRegions(regions: string[]) {
  const trpc = useTRPC()

  const enabled = regions.length > 0

  const queryOptions = useMemo(
    () => trpc?.products.countByRegions.queryOptions({ regions }),
    [trpc, regions],
  )

  const { data } = useQuery({
    ...queryOptions,
    enabled,
    staleTime: 5 * 60 * 1000,
  })
  return data || {}
}

/**
 * Хук для получения количества продуктов по массиву городов (cities)
 */
export function useProductCountsByCities(cities: string[]) {
  const trpc = useTRPC()

  const enabled = cities.length > 0

  const queryOptions = useMemo(
    () => trpc?.products.countByCities.queryOptions({ cities }),
    [trpc, cities],
  )

  const { data } = useQuery({
    ...queryOptions,
    enabled,
    staleTime: 5 * 60 * 1000,
  })
  return data || {}
}
