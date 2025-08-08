import { Task } from '../../external/types/task';

export interface MyTasksFilters {
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
}

export interface MyTasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface TaskTableRow {
  id: string;
  process: string;
  createBy: string;
  currentStep: string;
  waitingDays: string;
  status: string;
  taskInfo: Task;
}