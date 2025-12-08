"use server";

import { getIGRPProcessClient } from "@/lib/api-client";
import {
  PaginatedResponse,
  Process,
} from "@igrp/platform-process-management-types";

/**
 * Fetches all processes associated with a specific area.
 * @param areaId The ID of the area.
 * @returns A promise that resolves to a paginated response of processes.
 */
export const getAreaProcesses = async (
  areaId: string,
): Promise<PaginatedResponse<Process>> => {
  const httpClient = await getIGRPProcessClient();
  return (await httpClient.areas.getAreaProcesses(areaId)).data;
};

/**
 * Associates a process to a specific area.
 * @param areaId The ID of the area.
 * @param processData The process data to associate.
 * @returns A promise that resolves to the associated process.
 */
export const associateProcessToArea = async (
  areaId: string,
  processData: {
    processKey: string;
    releaseId: string;
    version: string;
    name: string;
  },
): Promise<Process> => {
  const processManagementClient = await getIGRPProcessClient();
  return (
    await processManagementClient.areas.associateProcessToArea(
      areaId,
      processData,
    )
  ).data;
};

/**
 * Removes a process from a specific area.
 * @param areaId The ID of the area.
 * @param processId The ID of the process to remove.
 * @returns A promise that resolves when the process is removed.
 */
export const removeProcessFromArea = async (
  areaId: string,
  processId: string,
): Promise<void> => {
  const processManagementClient = await getIGRPProcessClient();
  await processManagementClient.areas.removeProcessFromArea(areaId, processId);
};
