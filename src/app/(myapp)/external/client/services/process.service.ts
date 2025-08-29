'use server';
import { getHttpClient, getApplicationBase } from '../config/client.config';
import {
  CreateProcessArtifactRequest,
  PaginatedResponse,
  Process,
  ProcessArtifact,
  ProcessInstance,
  ProcessStats,
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
 * Fetches process instance statistics.
 * @returns A promise that resolves to process statistics.
 */
export const getProcessStats = async (): Promise<ProcessStats> => {
  const response = await httpClient.processes.getProcessStats();
  return response.data as ProcessStats;
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
 * Creates a new process artifact.
 * @param processDefinitionId The ID of the process definition to create the artifact for.
 * @param artifact The artifact to create.
 * @returns A promise that resolves to the created process artifact.
 */
export const createProcessArtifact = async (processDefinitionId: string, artifact: CreateProcessArtifactRequest): Promise<ProcessArtifact> => {
  const response = await httpClient.processes.createProcessArtifact(processDefinitionId, artifact);
  return response.data as ProcessArtifact;
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


/**
 * Process Number Configuration interface
 */
export interface ProcessNumberConfig {
  id?: string;
  name: string;
  prefix: string;
  dateFormat: string;
  checkDigit: boolean;
}

/**
 * Fetches process number configurations (temporary implementation)
 * @returns A promise that resolves to process number configurations
 */
export const getProcessNumberConfigs = async (): Promise<ProcessNumberConfig[]> => {
  // Temporary implementation - replace with actual API call
  return [
    {
      id: '1',
      name: 'Default Process Number',
      prefix: 'PROC',
      dateFormat: 'YYYY-MM-DD',
      checkDigit: true
    }
  ];
};

/**
 * Saves process number configuration (temporary implementation)
 * @param config The process number configuration to save
 * @returns A promise that resolves to the saved configuration
 */
export const saveProcessNumberConfig = async (config: ProcessNumberConfig): Promise<ProcessNumberConfig> => {
  // Temporary implementation - replace with actual API call
  console.log('Saving process number config:', config);
  return {
    ...config,
    id: config.id || Date.now().toString()
  };
};

/**
 * Deletes process number configuration (temporary implementation)
 * @param configId The ID of the configuration to delete
 * @returns A promise that resolves when deletion is complete
 */
export const deleteProcessNumberConfig = async (configId: string): Promise<void> => {
  // Temporary implementation - replace with actual API call
  console.log('Deleting process number config:', configId);
};
