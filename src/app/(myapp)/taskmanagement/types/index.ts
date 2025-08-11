export interface TaskManagementTableRow {
  process: string;
  createBy: string;
  currentStep: string;
  waitingDays: string;
  status: string;
  taskId: string;
  taskKey: string;
  processInstanceId?: string;
  procReleaseKey?: string;
  assignee?: string;
  createdDate?: string;
}

export interface TaskManagementFilters {
  processNumber?: string;
  processKey?: string;
  user?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  areaId?: string;
  subareaId?: string;
  processType?: string;
  organic?: string;
  searchTerm?: string;
}

export interface TaskManagementState {
  tasks: any[];
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export type TaskManagementTab = 'myTasks' | 'availableTasks';