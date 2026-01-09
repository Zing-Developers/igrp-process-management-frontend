import { ProcessInstance } from "@igrp/platform-process-management-types";
import { BadgeVariant } from "../../utils/status-helpers";

// Process Instance Statistics
export interface ProcessInstanceStats {
  totalInstances: number;
  totalCompleted: number;
  totalRunning: number;
  totalCancelled: number;
}

// Task Statistics
export interface TaskStats {
  // My Tasks (user-specific)
  totalMyTasks: number;
  totalMyTasksCompleted: number;
  totalMyTasksSuspended: number;
  totalMyTasksCancelled: number;

  // General Tasks (system-wide)
  totalTasks: number;
  totalTasksAssigned: number;
  totalTasksCompleted: number;
  totalTasksCancelled: number;
  totalTasksSuspended: number;

  totalTasksAvailable: number; // Tasks not assigned to current user
}

export interface DashboardStats {
  processInstances: ProcessInstanceStats;
  tasks: TaskStats;
}

export interface DashboardData {
  stats: DashboardStats;
  recentProcessInstances: ProcessInstance[];
  recentTasks: RecentItemsCardItem[]; // TODO: Define proper task type when available
}

export interface DashboardState {
  data: DashboardData;
  loading: boolean;
  error?: string;
}

export interface RecentItemsCardItem {
  id: string;
  title: string;
  subtitle: string;
  badge: {
    text: string;
    variant: BadgeVariant;
  };
}
