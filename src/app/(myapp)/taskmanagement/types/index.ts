import { Task, VariableParams } from "@igrp/platform-process-management-types";

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
  variables?: VariableParams;
  page?: number;
  size?: number;
}

export interface TaskManagementState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export type TaskManagementTab = "myTasks" | "availableTasks";

export interface TaskManagementTableRow {
  currentStep: string;
  process: string;
  assignedBy: string;
  startedAt: string;
  endedAt: string;
  priority: string;
  duration?: string;
  status: string;
  taskId: string;
  taskKey: string;
  processKey?: string;
  processInstanceId?: string;
  processName?: string;
}

export interface AssignTaskModalState {
  isOpen: boolean;
  selectedTask: TaskManagementTableRow | null;
}
