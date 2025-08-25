'use server';
import { getHttpClient, getApplicationBase } from '../config/client.config';
import {
  PaginatedResponse,
  Process,
  ProcessArtifact,
  ProcessInstance,
} from '@igrp/platform-process-management-types';

const httpClient = getHttpClient();
const applicationBase = getApplicationBase();

/**
 * Fetches a paginated list of processes.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 * @returns A promise that resolves to a paginated response of processes.
 */
export const getProcesses = async (page = 0, size = 20): Promise<PaginatedResponse<Process>> => {
  const response = await httpClient.processes.getProcesses({ page, size });
  return response.data as PaginatedResponse<Process>;
};



/**
 * Fetches a paginated list of processes.
 * @param processDefinitionId The ID of the process definition to fetch.
 * @returns A promise that resolves to a paginated response of processes.
 */
export const getProcessArtifacts = async (processDefinitionId: string): Promise<ProcessArtifact[]> => {
  const response = await httpClient.processes.getProcessArtifacts(processDefinitionId);
  return response.data as ProcessArtifact[];
};



/**
 * Fetches a paginated list of processes.
 * @param processDefinitionId The ID of the process definition to fetch.
 * @returns A promise that resolves to a paginated response of processes.
 */
export const getProcessDeployedArtifacts = async (processDefinitionId: string): Promise<ProcessArtifact[]> => {
  const response = await httpClient.processes.getProcessDeployedArtifacts(processDefinitionId);
  return response.data as ProcessArtifact[];
};

/**
 * Fetches a single process by its ID.
 * @param id The ID of the process to fetch.
 * @returns A promise that resolves to the process, or null if not found.
 */
export const getProcessById = async (id: string): Promise<Process | null> => {
  return (await httpClient.processes.getProcessById(id)).data as Process;
};

/**
 * Starts a new process instance.
 * @param processDefinitionId The ID of the process definition to start.
 * @param processKey The process key.
 * @param businessKey Optional business key for the process instance.
 * @param variables Optional variables to pass to the process instance.
 * @returns A promise that resolves to the newly created process instance.
 */
export const startProcess = async (
  processDefinitionId: string,
  processKey: string,
  businessKey?: string,
  variables?: Array<{ name: string; value: string }>,
): Promise<ProcessInstance> => {
  console.log('startProcess', processDefinitionId, processKey, applicationBase, businessKey, variables);
  
  const response = await httpClient.processes.startProcess(
    processDefinitionId,
    processKey,
    applicationBase,
    businessKey,
    variables,
  );
  return response.data as ProcessInstance;
};
