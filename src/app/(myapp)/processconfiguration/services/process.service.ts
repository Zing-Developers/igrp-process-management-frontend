import { PaginatedResponse, Process, ProcessInstance, ProcessArtifact } from '@igrp/platform-process-management-types';
import {
  getProcesses,
  getProcessById,
  startProcess,
  getProcessArtifacts,
  getProcessDeployedArtifacts,
} from '../../external/client/services/process.service';

export class ProcessService {
  static async getProcesses(page: number = 0, size: number = 20): Promise<PaginatedResponse<Process>> {
    return await getProcesses(page, size);
  }

  static async getProcessById(id: string): Promise<Process | null> {
    return await getProcessById(id);
  }

  static async startProcess(
    processDefinitionId: string,
    processKey: string,
    businessKey?: string,
    variables?: Array<{ name: string; value: string }>
  ): Promise<ProcessInstance> {
    return await startProcess(processDefinitionId, processKey, businessKey, variables);
  }

  static async getProcessArtifacts(processDefinitionId: string): Promise<ProcessArtifact[]> {
    return await getProcessArtifacts(processDefinitionId);
  }

  static async getProcessDeployedArtifacts(processDefinitionId: string): Promise<ProcessArtifact[]> {
    return await getProcessDeployedArtifacts(processDefinitionId);
  }
}