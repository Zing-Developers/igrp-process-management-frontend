import {
  getAreaProcesses,
  associateProcessToArea,
  removeProcessFromArea,
  CreateProcessRequest,
} from '../../external/client/services/area-process.service';
import { Process } from '../../external/types/process';
import { PaginatedResponse } from '../../external/types/response';

export class AreaProcessService {
  static async getAreaProcesses(areaId: string): Promise<PaginatedResponse<Process>> {
    const paginatedResponse = await getAreaProcesses(areaId);
    return paginatedResponse;
  }

  static async associateProcessToArea(areaId: string, processData: CreateProcessRequest): Promise<Process> {
    return await associateProcessToArea(areaId, processData);
  }

  static async removeProcessFromArea(areaId: string, processDefinitionId: string) {
    await removeProcessFromArea(areaId, processDefinitionId);
  }
}
