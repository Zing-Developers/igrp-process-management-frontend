import { ProcessInstance } from '../../external/types/process';
import { BadgeVariant } from '../../utils/status-helpers';

export interface DashboardStats {
  totalProcesses: number;
  totalTasks: number;
  myTasks: number;
  availableTasks: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentProcessInstances: ProcessInstance[];
  recentTasks: any[]; // TODO: Define proper task type when available
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