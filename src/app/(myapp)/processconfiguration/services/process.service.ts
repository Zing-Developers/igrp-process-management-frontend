import {
  PaginatedResponse,
  Process,
  ProcessArtifact,
  CreateProcessArtifactRequest,
} from "@igrp/platform-process-management-types";
import {
  getProcesses,
  getProcessById,
  getProcessArtifacts,
  getProcessDeployedArtifacts,
  createProcessArtifact,
  updateProcessArtifact,
} from "../../external/client/services/process";

export class ProcessService {
  static async getProcesses(
    page: number = 0,
    size: number = 20,
  ): Promise<PaginatedResponse<Process>> {
    return await getProcesses(page, size);
  }

  static async getProcessById(id: string): Promise<Process | null> {
    return await getProcessById(id);
  }

  static async getProcessArtifacts(
    processDefinitionId: string,
  ): Promise<ProcessArtifact[]> {
    return await getProcessArtifacts(processDefinitionId);
  }

  static async getProcessDeployedArtifacts(
    processDefinitionId: string,
  ): Promise<ProcessArtifact[]> {
    return await getProcessDeployedArtifacts(processDefinitionId);
  }

  static async createProcessArtifact(
    processDefinitionId: string,
    artifact: CreateProcessArtifactRequest,
  ): Promise<ProcessArtifact> {
    return await createProcessArtifact(processDefinitionId, artifact);
  }

  static async updateProcessArtifact(
    processDefinitionId: string,
    artifact: CreateProcessArtifactRequest,
  ): Promise<ProcessArtifact> {
    return await updateProcessArtifact(processDefinitionId, artifact);
  }
}
