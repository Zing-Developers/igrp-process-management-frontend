import {
  getProcesses,
  getProcessById,
  startProcess,
} from '../../external/client/services/process.service';
import { Process, ProcessInstance } from '../../external/types/process';
import { PaginatedResponse } from '../../external/types/response';

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
}