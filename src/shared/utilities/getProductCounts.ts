import { useMemo } from 'react'
import { useTRPC } from '@/shared/trpc/client'
import { useQuery } from '@tanstack/react-query'

/**
 * Хук для получения количества продуктов по массиву ID брендов
 */
export function useProductCountsByBrands(brandIds: number[]) {
  const trpc = useTRPC()

  const queryOptions = useMemo(() => {
    return trpc?.products.countByBrandIds.queryOptions({
      brandIds: brandIds.length > 0 ? brandIds : [0], // Избегаем пустого массива
    })
  }, [trpc, brandIds])

  const { data } = useQuery(queryOptions)
  return data || {}
}

/**
 * Хук для получения количества продуктов по массиву ID категорий вместе с их дочерними категориями
 */
export function useProductCountsByCategories(categoryIds: number[]) {
  const trpc = useTRPC()

  const queryOptions = useMemo(() => {
    return trpc?.products.countByCategoryAndChildrenIdsBulk.queryOptions({
      categoryIds: categoryIds.length > 0 ? categoryIds : [0], // Избегаем пустого массива
    })
  }, [trpc, categoryIds])

  const { data } = useQuery(queryOptions)
  return data || {}
}

/**
 * Хук для получения количества продуктов по массиву состяния товара (conditions)
 */
export function useProductCountsByConditions(conditions: string[]) {
  const trpc = useTRPC()

  const queryOptions = useMemo(() => {
    return trpc?.products.countByConditions.queryOptions({
      conditions: conditions.length > 0 ? conditions : [''], // Избегаем пустого массива
    })
  }, [trpc, conditions])

  const { data } = useQuery(queryOptions)
  return data || {}
}

/**
 * Хук для получения количества продуктов по массиву регионов (regions)
 */
export function useProductCountsByRegions(regions: string[]) {
  const trpc = useTRPC()

  const queryOptions = useMemo(() => {
    return trpc?.products.countByRegions.queryOptions({
      regions: regions.length > 0 ? regions : [''], // Избегаем пустого массива
    })
  }, [trpc, regions])

  const { data } = useQuery(queryOptions)
  return data || {}
}

/**
 * Хук для получения количества продуктов по массиву городов (cities)
 */
export function useProductCountsByCities(cities: string[]) {
  const trpc = useTRPC()

  const queryOptions = useMemo(() => {
    return trpc?.products.countByCities.queryOptions({
      cities: cities.length > 0 ? cities : [''], // Избегаем пустого массива
    })
  }, [trpc, cities])

  const { data } = useQuery(queryOptions)
  return data || {}
}
