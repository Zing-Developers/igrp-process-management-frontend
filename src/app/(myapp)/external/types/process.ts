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
  procReleaseKey: string;
  procReleaseId: string;
  number: string;
  status: 'CREATED' | 'COMPLETED' | 'SUSPENDED' | 'TERMINATED' | 'RUNNING';
  statusDesc: string;
  businessKey?: string;
  startedAt: string;
  startedBy: string;
  applicationBase: string;
  endTime?: string;
  variables?: Record<string, any>;
};

// For backward compatibility, keep the old structure as well
export type LegacyProcessInstance = {
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
