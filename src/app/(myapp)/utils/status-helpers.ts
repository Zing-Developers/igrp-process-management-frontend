// Process Instance Status Types
export type ProcessInstanceStatus = "CREATED" | "RUNNING" | "SUSPENDED" | "CANCELLED" | "COMPLETED" | "TERMINATED";

// Task Status Types
export type TaskStatus = "CREATED" | "ASSIGNED" | "COMPLETED" | "CANCELLED" | "DELETED";

// Badge Variant Types
export type BadgeVariant = "info" | "warning" | "success" | "destructive" | "secondary" | "default";

/**
 * Get localized status label for process instances
 */
export const getProcessInstanceStatusLabel = (status: ProcessInstanceStatus): string => {
  switch (status) {
    case 'CREATED':
      return 'Criado';
    case 'RUNNING':
      return 'Em execução';
    case 'SUSPENDED':
      return 'Suspenso';
    case 'CANCELLED':
      return 'Cancelado';
    case 'COMPLETED':
      return 'Concluído';
    case 'TERMINATED':
      return 'Terminado';
    default:
      return status;
  }
};

/**
 * Get localized status label for tasks
 */
export const getTaskStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case 'CREATED':
      return 'Criado';
    case 'ASSIGNED':
      return 'Em progresso';
    case 'COMPLETED':
      return 'Concluído';
    case 'CANCELLED':
      return 'Cancelado';
    case 'DELETED':
      return 'Excluído';
    default:
      return status;
  }
};

/**
 * Get badge variant for process instance status
 */
export const getProcessInstanceStatusVariant = (status: ProcessInstanceStatus): BadgeVariant => {
  switch (status) {
    case 'CREATED':
      return 'info';
    case 'RUNNING':
      return 'warning';
    case 'SUSPENDED':
      return 'secondary';
    case 'CANCELLED':
      return 'destructive';
    case 'COMPLETED':
      return 'success';
    case 'TERMINATED':
      return 'destructive';
    default:
      return 'success';
  }
};

/**
 * Get badge variant for task status
 */
export const getTaskStatusVariant = (status: TaskStatus): BadgeVariant => {
  switch (status) {
    case 'CREATED':
      return 'info';
    case 'ASSIGNED':
      return 'warning';
    case 'COMPLETED':
      return 'success';
    case 'CANCELLED':
      return 'destructive';
    case 'DELETED':
      return 'secondary';
    default:
      return 'default';
  }
};