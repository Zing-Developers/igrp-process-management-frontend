import {
  PaginatedResponse,
  Process,
  ProcessData,
} from "@igrp/platform-process-management-types";
import {
  getAreaProcesses,
  associateProcessToArea,
  removeProcessFromArea,
} from "../../external/client/services/area-process";

export class AreaProcessService {
  static async getAreaProcesses(
    areaId: string,
  ): Promise<PaginatedResponse<Process>> {
    const paginatedResponse = await getAreaProcesses(areaId);
    return paginatedResponse;
  }

  static async associateProcessToArea(
    areaId: string,
    processData: ProcessData,
  ): Promise<Process> {
    return await associateProcessToArea(areaId, processData);
  }

  static async removeProcessFromArea(
    areaId: string,
    processDefinitionId: string,
  ) {
    await removeProcessFromArea(areaId, processDefinitionId);
  }
}
