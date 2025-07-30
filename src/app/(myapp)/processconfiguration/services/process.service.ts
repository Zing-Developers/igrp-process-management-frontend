import {
  getProcesses,
  getProcessById,
  startProcess,
} from '../../external/client/services/process.service';
import { Process, ProcessInstance } from '../../external/types/process';
import { PaginatedResponse } from '../../external/types/response';
import { httpClient } from '../../external/client/services/http-client';
import { apiConfig } from '../../external/client/config/api.config';

export interface CreateProcessRequest {
  processKey: string;
  releaseId: string;
  areaId: string;
  version: string;
}

export interface RemoveProcessResponse {
  message: string;
}

export class ProcessService {
  static async getAllProcesses(page: number = 0, size: number = 100): Promise<Process[]> {
    try {
      const response = await getProcesses(page, size);
      return response.content || [];
    } catch (error) {
      console.warn('Error getting all processes');
      return [];
    }
  }

  static async getProcessById(id: string): Promise<Process | null> {
    return await getProcessById(id);
  }

  static async getAreaProcesses(areaId: string): Promise<Process[]> {
    try {
      return await httpClient.get<Process[]>(
        `${apiConfig.endpoints.areas}/${areaId}/process-definitions`
      );
    } catch (error) {
      console.warn('API call failed for getAreaProcesses');
      return [];
    }
  }

  static async associateProcessToArea(areaId: string, processData: CreateProcessRequest): Promise<Process> {
    try {
      return await httpClient.post<Process>(
        `${apiConfig.endpoints.areas}/${areaId}/process-definitions`,
        processData
      );
    } catch (error) {
      console.error('Error associating process to area:', error);
      throw error;
    }
  }

  static async removeProcessFromArea(areaId: string, processDefinitionId: string): Promise<RemoveProcessResponse> {
    try {
      return await httpClient.delete<RemoveProcessResponse>(
        `${apiConfig.endpoints.areas}/${areaId}/process-definitions/${processDefinitionId}`
      );
    } catch (error) {
      console.error('Error removing process from area:', error);
      throw error;
    }
  }

  static async startProcess(
    processDefinitionId: string,
    businessKey?: string,
    variables?: Record<string, any>
  ): Promise<ProcessInstance> {
    return await startProcess(processDefinitionId, businessKey, variables);
  }
}