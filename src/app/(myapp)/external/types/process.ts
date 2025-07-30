export type Process = {
  id: string;
  processKey: string;
  name?: string; // Add this for compatibility
  description?: string; // Add this for compatibility
  releaseId: string;
  areaId: string;
  status: string;
  statusDesc: string;
  version: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
  removedAt?: string | null;
  removedBy?: string | null;
};

export type ProcessInstance = {
  id: string;
  processDefinitionId: string;
  processDefinitionName: string;
  businessKey?: string;
  startDate: string;
  endTime?: string;
  initiator: string;
  status: 'CREATED' | 'COMPLETED' | 'SUSPENDED' | 'TERMINATED' | 'RUNNING';
  startedBy: string;
  variables?: Record<string, any>;
};
