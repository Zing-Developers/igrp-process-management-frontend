import { useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExtendedArea } from "../../process-configuration/types";
import {
  organizeAreasHierarchy,
  getAllAreasFlat,
} from "../../process-configuration/utils/area-hierarchy";
import { keepLatestByKey } from "../utils/versioning";
import { getAreas, getSubareas } from "@/app/(myapp)/client/area";

const PROCESS_MAP_AREAS_QUERY_KEY = ["process-map-areas"] as const;

async function fetchProcessMapAreas(): Promise<ExtendedArea[]> {
  const areasResponse = await getAreas({});
  const topLevelAreas =
    areasResponse.content?.filter((area) => !area.areaId) || [];

  return topLevelAreas.map((area) => ({
    ...area,
    process: area.process ? keepLatestByKey(area.process) : undefined,
    subareas: [],
  }));
}

export function useProcessMapData() {
  const queryClient = useQueryClient();
  const [loadedSubareasByParent, setLoadedSubareasByParent] = useState<
    Record<string, ExtendedArea[]>
  >({});

  const {
    data: queryData,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: PROCESS_MAP_AREAS_QUERY_KEY,
    queryFn: fetchProcessMapAreas,
  });

  const error =
    queryError instanceof Error
      ? queryError.message
      : queryError
        ? "Failed to load process map data"
        : undefined;

  const loadedNodes = useMemo(
    () => new Set(Object.keys(loadedSubareasByParent)),
    [loadedSubareasByParent],
  );

  const areas = useMemo(() => {
    const base = queryData ?? [];
    const flatAreas = getAllAreasFlat(base);

    Object.values(loadedSubareasByParent).forEach((subareas) => {
      subareas.forEach((subarea) => {
        const exists = flatAreas.find((area) => area.id === subarea.id);
        if (!exists) {
          flatAreas.push(subarea);
        }
      });
    });

    return organizeAreasHierarchy(flatAreas);
  }, [queryData, loadedSubareasByParent]);

  const refreshData = useCallback(() => {
    setLoadedSubareasByParent({});
    queryClient.invalidateQueries({ queryKey: PROCESS_MAP_AREAS_QUERY_KEY });
  }, [queryClient]);

  const loadSubareas = useCallback(
    async (parentAreaId: string) => {
      try {
        if (loadedSubareasByParent[parentAreaId]) {
          return;
        }

        const subareas = await getSubareas(parentAreaId);

        const normalizedSubareas: ExtendedArea[] = subareas.map((sa) => ({
          ...sa,
          process: sa.process ? keepLatestByKey(sa.process) : undefined,
        })) as ExtendedArea[];

        setLoadedSubareasByParent((prev) => ({
          ...prev,
          [parentAreaId]: normalizedSubareas,
        }));
      } catch (error) {
        console.error("Error loading subareas:", error);
        throw error;
      }
    },
    [loadedSubareasByParent],
  );

  return {
    areas,
    loadedNodes,
    loading,
    error,
    loadSubareas,
    refreshData,
  };
}
