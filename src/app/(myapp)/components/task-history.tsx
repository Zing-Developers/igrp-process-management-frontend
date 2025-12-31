"use client";

import {
  IGRPIcon,
  IGRPButton,
  IGRPBadge,
  IGRPDataTable,
  IGRPDataTableFacetedFilterFn,
  IGRPCopyTo,
  cn,
  IGRPBadgePrimitive,
} from "@igrp/igrp-framework-react-design-system";
import {
  formatDuration,
  getTypeColor,
  getTypeFromValue,
  getTypeIcon,
} from "../utils/columns-template";
import { getPriorityLabel } from "../utils/status-helpers";
import { getPriorityColor } from "../utils/status-badge";
import {
  ActivityProgress,
  ActivityEvent,
} from "@igrp/platform-process-management-types";

export interface TaskVariable {
  name: string;
  type?: string;
  value: unknown;
}

export interface HistoricTask
  extends Omit<ActivityProgress, "activityDetails"> {
  activityId: string;
  activityName: string;
  activityKey: string;
  name?: string;
  assignee: string;
  owner?: string;
  claimTime?: string;
  dueDate?: string;
  priority?: number;
  formKey?: string;
  outcome?: string;
  duration?: number;
  status: string;
  variables?: TaskVariable[];
  activityDetails?: ActivityEvent | null;
}

interface TaskHistoryProps {
  tasks: HistoricTask[];
}

function TaskHistory({ tasks }: TaskHistoryProps) {
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      completed: "Concluído",
      current: "Atual",
      pending: "Pendente",
    };
    const normalizedStatus = status.toLowerCase();
    return (
      statusMap[normalizedStatus] ||
      status.charAt(0).toUpperCase() + status.toLowerCase().slice(1)
    );
  };

  const renderVariableValue = (variable: TaskVariable) => {
    const isJson = typeof variable.value === "object";
    const variableValue = variable.value;

    if (isJson) {
      return (
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <pre className="text-xs bg-muted/50 rounded p-2 overflow-x-auto max-h-32 flex-1 text-foreground">
              {JSON.stringify(variableValue, null, 2)}
            </pre>
            <IGRPCopyTo value={JSON.stringify(variableValue, null, 2)} />
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-sm text-foreground truncate">
          {String(variableValue)}
        </span>
        <IGRPCopyTo value={String(variableValue)} />
      </div>
    );
  };

  return (
    <>
      <IGRPDataTable<HistoricTask, HistoricTask>
        id="taskHistory"
        showFilter={true}
        showPagination={true}
        columns={[
          {
            id: "expand",
            header: "",
            size: 24,
            cell: ({ row }) => {
              const task = row.original;
              const hasVariables =
                task.activityDetails?.variables &&
                task.activityDetails?.variables.length > 0;
              const isExpanded = row.getIsExpanded();

              if (!hasVariables) return null;

              return (
                <div className="w-6 flex items-center justify-center">
                  <IGRPButton
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      row.toggleExpanded();
                    }}
                    iconName={isExpanded ? "ChevronDown" : "ChevronRight"}
                  />
                </div>
              );
            },
            enableHiding: false,
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: "Tarefa",
            accessorKey: "name",
            cell: ({ row }) => {
              const task = row.original;
              return (
                <div>
                  <div className="font-medium text-foreground">
                    {task.activityName}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {task.activityKey}
                  </div>
                </div>
              );
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: "Utilizador",
            accessorKey: "assignee",
            cell: ({ row }) => {
              const task = row.original;
              return (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                    <IGRPIcon
                      iconName="User"
                      className="h-3.5 w-3.5 text-muted-foreground"
                    />
                  </div>
                  <span className="text-sm text-foreground">
                    {task.assignee || "-"}
                  </span>
                </div>
              );
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: "Prioridade",
            accessorKey: "priority",
            cell: ({ row }) => {
              const task = row.original;
              return (
                <div
                  className={`flex items-center gap-1.5 ${getPriorityColor({ priority: task.priority || 0 }).bgClass.replace("bg-", "text-")}`}
                >
                  <IGRPIcon iconName="Flag" className="h-3.5 w-3.5" />
                  <span className="text-sm">
                    {getPriorityLabel(task.priority || 0)}
                  </span>
                </div>
              );
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: "Duração",
            accessorKey: "duration",
            cell: ({ row }) => {
              const task = row.original;
              return (
                <div className="text-sm text-muted-foreground">
                  {task.duration ? formatDuration(task.duration) : "-"}
                </div>
              );
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: "Resultado",
            accessorKey: "outcome",
            cell: ({ row }) => {
              const task = row.original;
              return (
                <div>
                  {task.status && (
                    <IGRPBadgePrimitive
                      variant="outline"
                      className={cn(
                        "flex flex-row items-center gap-1",
                        task.status === "COMPLETED"
                          ? "text-[oklch(0.7_0.18_150)] border-[oklch(0.7_0.18_150)]"
                          : "text-muted-foreground",
                      )}
                    >
                      <IGRPIcon iconName="CircleCheck" className="h-3 w-3" />
                      <span className="text-sm">
                        {getStatusLabel(task.status)}
                      </span>
                    </IGRPBadgePrimitive>
                  )}
                </div>
              );
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
        ]}
        clientFilters={[]}
        data={tasks}
        getRowCanExpand={(row) => {
          const task = row.original;
          return !!(
            task.activityDetails?.variables &&
            task.activityDetails?.variables.length > 0
          );
        }}
        renderSubComponent={(row) => {
          const task = row.original;
          const hasVariables =
            task.activityDetails?.variables &&
            task.activityDetails?.variables.length > 0;

          if (!hasVariables) return undefined;

          return (
            <div className="px-4 py-3 bg-muted/20 rounded-b-md">
              <div className="ml-10">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Variáveis da Tarefa ({task.activityDetails?.variables!.length}
                  )
                </h4>
                <div className="space-y-2">
                  {task.activityDetails?.variables!.map((variable, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 rounded-md bg-background border border-border"
                    >
                      <div className="flex items-center gap-2 min-w-[180px]">
                        <IGRPBadgePrimitive
                          className={`text-[10px] px-1.5 py-0 flex items-center gap-1 ${getTypeColor(variable.value)}`}
                        >
                          {getTypeIcon(variable.value)}
                          {getTypeFromValue(variable.value)}
                        </IGRPBadgePrimitive>
                        <span className="text-sm font-medium text-foreground font-mono">
                          {variable.name}
                        </span>
                      </div>
                      {renderVariableValue(variable)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }}
      />
    </>
  );
}

export { TaskHistory };
