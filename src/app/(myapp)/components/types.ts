import { IGRPOptionsProps } from "@igrp/igrp-framework-react-design-system";

export interface RecentProcess {
  processDefinitionId: string;
  title: string;
  category: string;
  version: string;
}

export interface RecentTask {
  id: string;
  name: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export const OperatorOptions: IGRPOptionsProps[] = [
  { label: "Igual", value: "EQUALS" },
  {
    label: "Igual (Ignorar Maiúsculas/Minúsculas)",
    value: "EQUALS_IGNORE_CASE",
  },
  { label: "Diferente", value: "NOT_EQUALS" },
  {
    label: "Diferente (Ignorar Maiúsculas/Minúsculas)",
    value: "NOT_EQUALS_IGNORE_CASE",
  },
  { label: "Maior Que", value: "GREATER_THAN" },
  { label: "Maior ou Igual", value: "GREATER_THAN_OR_EQUAL" },
  { label: "Menor Que", value: "LESS_THAN" },
  { label: "Menor ou Igual", value: "LESS_THAN_OR_EQUAL" },
  { label: "Contém", value: "LIKE" },
  {
    label: "Contém (Ignorar Maiúsculas/Minúsculas)",
    value: "LIKE_IGNORE_CASE",
  },
];
