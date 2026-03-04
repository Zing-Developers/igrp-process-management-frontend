import { PRIORITY_OPTIONS } from "../config/constants";

export interface PriorityOption {
  value: string;
  label: string;
}

export enum Priority {
  NORMAL = "1",
  URGENTE = "2",
}

export const getPriorityLabel = (value: string): string => {
  const option = PRIORITY_OPTIONS.find((opt) => opt.value === value);
  return option?.label || "Prioridade Desconhecida";
};
