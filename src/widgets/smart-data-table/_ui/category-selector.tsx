import { Category } from "@/entities/category/_domain/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import React from "react"

interface CategorySelectorProps {
  categories?: Category[]
  selectedCategoryId?: number
  setSelectedCategoryId: (id: number | undefined) => void
}

export function CategorySelector({
  categories,
  setSelectedCategoryId,
}: CategorySelectorProps) {
  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value ? Number(value) : undefined)
  }

  // Рекурсивно строим список опций
  const renderCategoryOptions = (categories: Category[], level = 0) => {
    return categories.map((category) => (
      <React.Fragment key={category.id}>
        <SelectItem value={category.id + ""} >
          {"— ".repeat(level) + category.name}
        </SelectItem>
        {category.children &&
          renderCategoryOptions(category.children, level + 1)}
      </React.Fragment>
    ))
  }
  return (
    <div className="relative w-full">
      <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full rounded-lg text-muted-foreground">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            {categories && renderCategoryOptions(categories)}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
