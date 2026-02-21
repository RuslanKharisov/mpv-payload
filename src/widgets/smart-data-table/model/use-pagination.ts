import { useSearchParams } from 'next/navigation'
import { useState, useMemo } from 'react'

export const usePagination = () => {
  const searchParams = useSearchParams()

  // Берем начальные значения прямо из URL, чтобы стейт не конфликтовал с реальностью
  const initialPage = Number(searchParams.get('page')) || 1
  const initialPerPage = Number(searchParams.get('perPage')) || 5

  const [pagination, setPagination] = useState({
    pageIndex: initialPage - 1, // в API обычно 0-based
    pageSize: initialPerPage,
  })

  // Вычисляем skip на лету, чтобы не плодить стейты
  const skip = useMemo(() => pagination.pageIndex * pagination.pageSize, [pagination])

  return {
    skip,
    pagination,
    setPagination,
  }
}
