"use client"

import { useState } from "react"
import { CategorySelector } from "./category-selector"
import { useGetCategories } from "@/entities/category/_api/category.queries"
import { TextFilterInput } from "../../../shared/ui/text-filter-input"

interface DataTableSearchBarProps {
  searchQueryDraft: string
  handleSearchChange: (value: string) => void
  applyFilters: () => void
}

export function DataTableSearchBar({
  searchQueryDraft,
  handleSearchChange,
  applyFilters,
}: DataTableSearchBarProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined)

  const { data: categories } = useGetCategories()

  return (
    <div className="my-5 flex flex-col items-center justify-center gap-5 py-4 sm:flex-row">
      <TextFilterInput
        value={searchQueryDraft} // Отображаем черновик
        onChange={(e) => handleSearchChange(e.target.value)} // Обновляем черновик
        applyFilter={applyFilters} // Применяем фильтр
        placeholder="Искать по артикулу или описанию ..."
      />

      <CategorySelector
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
      />
    </div>
  )
}
