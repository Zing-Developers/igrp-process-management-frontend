import { Task } from '@igrp/platform-process-management-types';

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
  process: any;
  startedAt: any;
  endAt: any;
  processNumber: string;
  assignedBy: any;
  currentStep: string;
  waitingDays: string;
  status: string;
  taskInfo: Task;
  processKey: string;
  processInstanceId: string;
  taskKey: string;
  taskId: string;
}
