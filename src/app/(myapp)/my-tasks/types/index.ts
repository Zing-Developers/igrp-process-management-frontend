import { Task } from "@igrp/platform-process-management-types";

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
  totalElements?: number;
  totalPages?: number;
  pageNumber?: number;
  pageSize?: number;
  error?: string | null | undefined;
}

export interface TaskTableRow {
  currentStep: string;
  process: string;
  startedAt: string;
  endedAt?: string;
  priority: string;
  duration: string;
  //processKey: string;
  //processInstanceId: string;
  //taskKey: string;
  taskId: string;
  processName: string;
}
