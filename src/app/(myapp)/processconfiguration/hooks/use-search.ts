import { useState, useMemo } from 'react';
import { filterAreasRecursively } from '../utils/area-hierarchy';
import { ExtendedArea } from '../types';

export function useSearch(areas: ExtendedArea[]) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAreas = useMemo(() => {
    return filterAreasRecursively(areas, searchTerm);
  }, [areas, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredAreas,
  };
}