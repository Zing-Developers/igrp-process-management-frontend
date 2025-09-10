import { Task } from '@igrp/platform-process-management-types';

export interface AvailableTasksFilters {
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

export interface AvailableTasksState {
  tasks: Task[];
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

export interface AvailableTasksData {
  tasks: AvailableTasksState;
  filters: AvailableTasksFilters;
  dropdownOptions: DropdownOptions;
}

// Table row type that matches the generated page structure
export interface TaskTableRow {
  processInfo: string;
  processNumber: string;
  startedAt: string;
  endAt: string;
  createBy:  string;
  taskName: string;
  status: string;
  daysWaiting: string;
  // Additional fields for internal use
  taskId: string;
  processInstanceId: string;
  createdDate: string;
  assignee?: string;
  priority: string;
}
