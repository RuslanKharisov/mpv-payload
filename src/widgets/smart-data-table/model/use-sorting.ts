import { SortingState, Updater } from "@tanstack/react-table";
import { useState } from "react";

export const useSorting = () => {
  const [sortBy, setSortBy] = useState<SortingState>([]);

  const onSortingChange = (updaterOrValue: Updater<SortingState>) => {
    // Если updaterOrValue — это функция, вызываем её с текущим значением sortBy
    // Иначе — просто устанавливаем его как новое значение
    setSortBy((prevSortBy) =>
      typeof updaterOrValue === "function" ? updaterOrValue(prevSortBy) : updaterOrValue
    );
  };

  return {
     sortBy,
     onSortingChange
    };
};
