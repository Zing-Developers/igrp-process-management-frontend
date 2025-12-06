import {
  getTaskStatusLabel,
  getTaskStatusVariant,
  getProcessInstanceStatusLabel,
  getProcessInstanceStatusVariant,
  getPriorityLabel,
  getPriorityVariant,
  TaskStatus,
  ProcessInstanceStatus,
} from "./status-helpers";

// Shared utility function to map badge variants to CSS classes
const getBgClass = (
  variant: string,
  useBlueForInfo: boolean = false,
): string => {
  switch (variant) {
    case "success":
      return "bg-green-100 text-green-800";
    case "warning":
      return "bg-orange-100 text-orange-800";
    case "info":
      return useBlueForInfo
        ? "bg-blue-100 text-blue-800"
        : "bg-yellow-100 text-yellow-800";
    case "destructive":
      return "bg-red-100 text-red-800";
    case "secondary":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getTaskStatusColor = (task: { status: string }) => {
  const status = task.status?.toUpperCase() as TaskStatus;
  const label = getTaskStatusLabel(status);
  const variant = getTaskStatusVariant(status);

  return {
    label,
    bgClass: getBgClass(variant),
    textClass: "",
    className: "",
    iconName: "",
  };
};

export const getProcessInstanceStatusColor = (processInstance: {
  status: string;
}) => {
  const status = processInstance.status?.toUpperCase() as ProcessInstanceStatus;
  const label = getProcessInstanceStatusLabel(status);
  const variant = getProcessInstanceStatusVariant(status);

  return {
    label,
    bgClass: getBgClass(variant, true), // Use blue for info variant in process instances
    textClass: "",
    className: "",
    iconName: "",
  };
};

export const getPriorityColor = (item: { priority: string | number }) => {
  // Handle your priority system (1-5 scale)
  const priority = item.priority;
  const label = getPriorityLabel(priority);
  const variant = getPriorityVariant(priority);

  return {
    label,
    bgClass: getBgClass(variant),
    textClass: "",
    className: "",
    iconName: "",
  };
};
