import { useState, useEffect } from "react";
import { AreaProcessesMap, ExtendedArea } from "../types";
import { organizeAreasHierarchy } from "../utils/area-hierarchy";
import { Area, Process } from "@igrp/platform-process-management-types";
import { getAreas } from "@/app/(myapp)/client/area";

export function useConfiguration() {
  const [areas, setAreas] = useState<ExtendedArea[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [areaProcesses, setAreaProcesses] = useState<AreaProcessesMap>({});
  const [allActiveProcesses, setAllActiveProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load only top-level areas (no parentId)
        const areasResponse = await getAreas();

        // Organize flat areas into hierarchical structure
        const hierarchicalAreas = organizeAreasHierarchy(
          areasResponse.content || [],
        );
        setAreas(hierarchicalAreas);

        // Extract all processes from areas for the global processes list (for process selection)
        const allProcesses: Process[] = [];

        (areasResponse.content || []).forEach((area) => {
          const areaProcessList = area.process || [];
          allProcesses.push(...areaProcessList);
        });

        setProcesses(allProcesses);

        // Initialize areaProcesses as empty - processes will be loaded on-demand when areas are expanded
        setAreaProcesses({});

        const activeProcesses = getActiveProcesses(areasResponse.content || []);
        setAllActiveProcesses(activeProcesses);
      } catch (error) {
        console.error("Error loading configuration data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  function getActiveProcesses(flatAreas: Area[]) {
    const activeProcesses = flatAreas
      .flatMap((area) =>
        (area.process || []).map((process) => ({
          ...process,
          applicationBase: area.applicationBase,
          id: process.releaseId,
        })),
      )
      .filter((process) => process.status === "ACTIVE");

    const processList = Array.from(
      new Map(activeProcesses.map((p) => [p.releaseId, p])).values(),
    );
    return processList;
  }

  return {
    areas,
    setAreas,
    processes,
    setProcesses,
    areaProcesses,
    setAreaProcesses,
    allActiveProcesses,
    loading,
  };
}
