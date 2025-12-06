import { useState, useEffect, useCallback } from "react";
import { ExtendedArea } from "../../processconfiguration/types";
import { AreaService } from "../../processconfiguration/services/area.service";
import {
  organizeAreasHierarchy,
  getAllAreasFlat,
} from "../../processconfiguration/utils/area-hierarchy";
import { keepLatestByKey } from "../utils/versioning";

export function useProcessMapData() {
  const [areas, setAreas] = useState<ExtendedArea[]>([]);
  const [loadedNodes, setLoadedNodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      const areasResponse = await AreaService.getAreas("");
      const topLevelAreas =
        areasResponse.content?.filter((area) => !area.areaId) || [];

      const extendedAreas: ExtendedArea[] = topLevelAreas.map((area) => ({
        ...area,
        process: area.process ? keepLatestByKey(area.process) : undefined,
        subareas: [],
      }));

      setAreas(extendedAreas);
    } catch (err) {
      setError("Failed to load process map data");
      console.error("Error loading process map data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubareas = useCallback(
    async (parentAreaId: string) => {
      try {
        if (loadedNodes.has(parentAreaId)) {
          return;
        }

        const subareas = await AreaService.getSubareas(parentAreaId);
        console.log("Loaded subareas for area", parentAreaId, ":", subareas);

        const normalizedSubareas = subareas.map((sa) => ({
          ...sa,
          process: sa.process ? keepLatestByKey(sa.process) : undefined,
        }));

        setAreas((prev) => {
          const flatAreas = getAllAreasFlat(prev);

          normalizedSubareas.forEach((subarea) => {
            const exists = flatAreas.find((area) => area.id === subarea.id);
            if (!exists) {
              flatAreas.push(subarea as ExtendedArea);
            }
          });
          console.log("Updated flat areas after adding subareas:", flatAreas);

          return organizeAreasHierarchy(flatAreas);
        });
        console.log("Updated areas after loading subareas:", areas);

        setLoadedNodes((prev) => new Set([...prev, parentAreaId]));
      } catch (error) {
        console.error("Error loading subareas:", error);
        throw error;
      }
    },
    [loadedNodes],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = useCallback(async () => {
    setLoadedNodes(new Set()); // Reset loaded nodes
    await loadData();
  }, [loadData]);

  return {
    areas,
    loadedNodes,
    loading,
    error,
    loadSubareas,
    refreshData,
  };
}
