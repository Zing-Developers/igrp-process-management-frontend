import { Process } from './process';

export interface Area {
  id: string;
  code: string;
  name: string;
  description?: string;
  areaId?: string; // Parent area ID for subareas
  process?: Process[]; // Array of processes associated with this area
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateAreaRequest {
  code: string;
  name: string;
  description?: string;
  applicationBase: string;
  parentId?: string; // Parent area ID for creating subareas
}

export interface UpdateAreaRequest {
  code?: string;
  name?: string;
  description?: string;
  applicationBase: string;
  parentId?: string;
}

export interface AreaWithProcesses extends Area {
  process?: Process[];
  subareas?: AreaWithProcesses[];
}

// Paginated response interface
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Keep for backward compatibility if needed, but mark as deprecated
/** @deprecated Use AreaWithProcesses instead */
export interface AreaWithProjects extends Area {
  projects?: any[];
  subareas?: AreaWithProjects[];
}
