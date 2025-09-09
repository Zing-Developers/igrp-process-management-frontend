import { Task } from '@igrp/platform-process-management-types';
import { ReactNode } from 'react';

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
  currentStep: string;
  process: string;
  startedAt: string;
  endAt: string;
  priority: string;
  waitingDays: string;
  processKey: string;
  processInstanceId: string;
  taskKey: string;
  taskId: string;
  processName: string;
}
