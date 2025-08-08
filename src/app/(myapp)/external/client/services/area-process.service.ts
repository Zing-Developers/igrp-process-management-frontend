'use server';
import {
  shouldUseDummyData,
  logDummyDataFallback,
  createPaginatedResponse,
} from '../dummy-data/utils';
import { processes } from '../dummy-data/processes';
import { ProcessManagementClient } from '@igrp/platform-process-management-client-ts';
import { PaginatedResponse, Process } from '@igrp/platform-process-management-types';

const baseUrl = process.env.PROCESS_MANAGEMENT_CLIENT_BASE_URL || 'http://localhost:8080';

const httpClient = ProcessManagementClient.create({
  baseUrl: baseUrl,
  timeout: 30000, // optional, defaults to 30000 (30 seconds)
  headers: {
    // optional
    //Authorization: 'Bearer your-token-here',
  },
});

export interface CreateProcessRequest {
  processKey: string;
  name: string;
  releaseId: string;
  version: string;
}

/**
 * Fetches all processes associated with a specific area.
 * @param areaId The ID of the area.
 * @returns A promise that resolves to a paginated response of processes.
 */
export const getAreaProcesses = async (areaId: string): Promise<PaginatedResponse<Process>> => {
  try {
    return (await httpClient.areas.getAreaProcesses(areaId)).data;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('getAreaProcesses', error);
      // Return dummy processes for the area as paginated response
      return createPaginatedResponse(processes.slice(0, 3), 0, 50);
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Associates a process to a specific area.
 * @param areaId The ID of the area.
 * @param processData The process data to associate.
 * @returns A promise that resolves to the associated process.
 */
export const associateProcessToArea = async (
  areaId: string,
  processData: CreateProcessRequest,
): Promise<Process> => {
  try {
    console.log('associateProcessToArea', areaId, processData);
    return (await httpClient.areas.associateProcessToArea(areaId, processData)).data;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('associateProcessToArea', error);
      // Return a dummy process that matches the Process type
      const currentTime = new Date().toISOString();
      return {
        id: `dummy-${Date.now()}`,
        processKey: processData.processKey,
        name: `Process ${processData.processKey}`,
        description: `Dummy process for ${processData.processKey}`,
        releaseId: processData.releaseId,
        areaId: areaId,
        status: 'ACTIVE',
        statusDesc: 'Active',
        version: processData.version,
        createdAt: currentTime,
        createdBy: 'dummy-user',
      };
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Removes a process from a specific area.
 * @param areaId The ID of the area.
 * @param processDefinitionId The ID of the process definition to remove.
 * @returns A promise that resolves to a removal response.
 */
export const removeProcessFromArea = async (areaId: string, processDefinitionId: string) => {
  try {
    console.log('removeProcessFromArea', areaId, processDefinitionId);
    await httpClient.areas.removeProcessFromArea(areaId, processDefinitionId);
  } catch (error) {
    throw error;
  }
};
