import { useState } from "react";
import { useDropdownData, FilterState } from "./use-dropdown-data";

export function useFilterData(isProcess?: boolean) {
  const [filters, setFilters] = useState<FilterState>({
    areaId: "",
    subareaId: "",
    processType: "",
    processNumber: "",
    status: "",
    dateFrom: null,
    dateTo: null,
    organic: "",
    user: "",
    variables: [],
  });

  const { dropdownOptions } = useDropdownData(filters, isProcess);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    console.log("resetFilters");
    updateFilters({
      areaId: "",
      subareaId: "",
      processType: "",
      processNumber: "",
      status: "",
      dateFrom: null,
      dateTo: null,
    });
    console.log("filters", filters);
  };

  return {
    filters,
    dropdownOptions,
    updateFilters,
    resetFilters,
  };
}
