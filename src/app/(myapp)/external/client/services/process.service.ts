'use server';
import {
  getDummyProcessById,
  getDummyProcessesPaginated,
  createDummyProcessInstance,
} from '../dummy-data/processes';

import { shouldUseDummyData, logDummyDataFallback } from '../dummy-data/utils';
import { ProcessManagementClient } from '@igrp/platform-process-management-client-ts';
import {
  PaginatedResponse,
  Process,
  ProcessInstance,
} from '@igrp/platform-process-management-types';

const applicationBase = process.env.IGRP_APPLICATION_BASE || 'igrp-app';
const baseUrl = process.env.PROCESS_MANAGEMENT_CLIENT_BASE_URL || 'http://localhost:8080';

const httpClient = ProcessManagementClient.create({
  baseUrl: baseUrl,
  timeout: 30000, // optional, defaults to 30000 (30 seconds)
  headers: {
    // optional
    //Authorization: 'Bearer your-token-here',
  },
});
/**
 * Fetches a paginated list of processes.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 * @returns A promise that resolves to a paginated response of processes.
 */
export const getProcesses = async (page = 0, size = 20): Promise<PaginatedResponse<Process>> => {
  try {
    const response = await httpClient.processes.getProcesses({ page, size });
    return response.data as PaginatedResponse<Process>;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('getProcesses', error);
      return getDummyProcessesPaginated(page, size);
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Fetches a single process by its ID.
 * @param id The ID of the process to fetch.
 * @returns A promise that resolves to the process, or null if not found.
 */
export const getProcessById = async (id: string): Promise<Process | null> => {
  try {
    return (await httpClient.processes.getProcessById(id)).data as Process;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('getProcessById', error);
      return getDummyProcessById(id) || null;
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Starts a new process instance.
 * @param processDefinitionId The ID of the process definition to start.
 * @param processKey The process key.
 * @param businessKey Optional business key for the process instance.
 * @param applicationBase The application base.
 * @param variables Optional variables to pass to the process instance.
 * @returns A promise that resolves to the newly created process instance.
 */
export const startProcess = async (
  processDefinitionId: string,
  processKey: string,
  businessKey?: string,
  variables?: Array<{ name: string; value: string }>,
): Promise<ProcessInstance> => {

  try {
    console.log('startProcess', processDefinitionId, processKey, applicationBase, businessKey, variables);
    
    const response = await httpClient.processes.startProcess(
      processDefinitionId,
      processKey,
      applicationBase,
      businessKey,
      variables,
    );
    return response.data as ProcessInstance;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('startProcess', error);
      return createDummyProcessInstance(processDefinitionId, businessKey);
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};
