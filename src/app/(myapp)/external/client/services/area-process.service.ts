import { getHttpClient } from '../config/client.config';
import { PaginatedResponse, Process } from '@igrp/platform-process-management-types';

const httpClient = getHttpClient();

/**
 * Fetches all processes associated with a specific area.
 * @param areaId The ID of the area.
 * @returns A promise that resolves to a paginated response of processes.
 */
export const getAreaProcesses = async (areaId: string): Promise<PaginatedResponse<Process>> => {
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
  processData: { processKey: string; processNumber: number },
): Promise<Process> => {
  return (await httpClient.areas.associateProcessToArea(areaId, processData)).data;
};

/**
 * Removes a process from a specific area.
 * @param areaId The ID of the area.
 * @param processId The ID of the process to remove.
 * @returns A promise that resolves when the process is removed.
 */
export const removeProcessFromArea = async (areaId: string, processId: string): Promise<void> => {
  await httpClient.areas.removeProcessFromArea(areaId, processId);
};
