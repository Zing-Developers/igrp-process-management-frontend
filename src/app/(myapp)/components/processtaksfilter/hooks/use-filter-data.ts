import { useState } from 'react';
import { useDropdownData, FilterState } from './use-dropdown-data';

export function useFilterData() {
  const [filters, setFilters] = useState<FilterState>({
    areaId: '',
    subareaId: '',
    processType: '',
    processNumber: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    organic: '',
    user: '',
  });

  const { dropdownOptions } = useDropdownData(filters);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    console.log("newFilters", newFilters);

    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      areaId: '',
      subareaId: '',
      processType: '',
      processNumber: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      organic: '',
      user: '',
    });
  };

  return {
    filters,
    dropdownOptions,
    updateFilters,
    resetFilters,
  };
}