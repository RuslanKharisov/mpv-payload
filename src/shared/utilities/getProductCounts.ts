import { useMemo } from 'react'
import { useTRPC } from '@/shared/trpc/client'
import { useQuery } from '@tanstack/react-query'

// Хуки для отдельных элементов (используют кэширование из bulk запросов)
export function useProductCountByBrand(brandId: number) {
  const trpc = useTRPC()

  // Получаем все бренды через bulk запрос
  // Но возвращаем только значение для конкретного бренда
  const queryOptions = useMemo(() => {
    return trpc?.products.countByBrandId.queryOptions({
      brandId: brandId || 0,
    })
  }, [trpc, brandId])

  const { data } = useQuery(queryOptions)
  return data?.totalDocs || 0
}

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

// Bulk хуки для использования в компонентах фильтров
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
