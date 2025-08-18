import { ProcessInstance } from '../../external/types/process';

export interface ProcessInstancesFilters {
  processNumber: string;
  processKey: string;
  user: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  areaId?: string;
  subareaId?: string;
  processType?: string;
  organic?: string;
  // Process instance specific filters
  procReleaseKey?: string;
  procReleaseId?: string;
  applicationBase?: string;
  businessKey?: string;
  startedBy?: string;
}

export interface ProcessInstancesState {
  processInstances: ProcessInstance[];
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface DropdownOptions {
  areas: Array<{ label: string; value: string }>;
  subareas: Array<{ label: string; value: string }>;
  processTypes: Array<{ label: string; value: string }>;
  statuses: Array<{ label: string; value: string }>;
  organics: Array<{ label: string; value: string }>;
  users: Array<{ label: string; value: string }>;
}

export interface ProcessInstanceTableRow {
  processInfo: string;
  createBy: string;
  currentStep: string;
  daysWaiting: string;
  status: string;
  processInstanceId: string;
  procReleaseKey: string;
  startedBy: string;
  version: string;
}