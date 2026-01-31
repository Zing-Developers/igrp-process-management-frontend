import { useMemo } from "react";
import { getAllAreasFlat } from "../utils/area-hierarchy";
import { ExtendedArea } from "../types";

export function useComputedValues(areas: ExtendedArea[]) {
  const allAreasFlat = useMemo(() => {
    return getAllAreasFlat(areas);
  }, [areas]);

  return {
    allAreasFlat,
  };
}
