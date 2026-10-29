"use client";

import {
  IGRPAlertDescriptionPrimitive,
  IGRPAlertPrimitive,
  IGRPAlertTitlePrimitive,
  IGRPBadgePrimitive,
  IGRPButton,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import type {
  ActivityProgress,
  FailedJob,
} from "@irn/platform-process-management-types";
import { CircleAlert, Info, RefreshCw, Zap } from "lucide-react";
import { type ComponentProps, Fragment, useMemo, useState } from "react";
import {
  FailedJobActionController,
  type FailedJobActionItem,
} from "@/app/(myapp)/components/failed-job-action-controller";

type Failure = {
  jobId?: string;
  errorMessage?: string;
  attempts?: number;
  firstFailedAt?: string;
  lastFailedAt?: string;
  reprocessCount?: number;
  lastReprocessedAt?: string;
  lastReprocessedBy?: string;
};

const activityTypeLabels: Record<string, string> = {
  START_EVENT: "Evento",
  END_EVENT: "Evento",
  USER_TASK: "Tarefa",
  SERVICE_TASK: "Serviço",
  SCRIPT_TASK: "Script",
  MANUAL_TASK: "Tarefa manual",
  EXCLUSIVE_GATEWAY: "Divisão / junção",
  PARALLEL_GATEWAY: "Divisão / junção",
  INCLUSIVE_GATEWAY: "Divisão / junção",
};

const statusLabels: Record<string, string> = {
  completed: "Concluída",
  current: "Em curso",
  pending: "Por iniciar",
  retry: "A tentar de novo",
  retrying: "A tentar de novo",
  reprocessing: "A tentar de novo",
  failed: "Falhou",
  error: "Falhou",
};

const formatTime = (value?: string) => {
  if (!value || Number.isNaN(new Date(value).getTime())) return "—";

  return new Intl.DateTimeFormat("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(value));
};

const formatDateTime = (value?: string) => {
  if (!value || Number.isNaN(new Date(value).getTime())) return "—";

  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(value));
};

const matchesId = (left?: string, right?: string) =>
  Boolean(left && right && left === right);

const hasActiveFailure = (
  activity: ActivityProgress,
  failedJob?: FailedJob,
) => {
  if (activity.status) {
    return ["FAILED", "ERROR"].includes(activity.status.toUpperCase());
  }

  return Boolean(failedJob || activity.errorMessage);
};

const getFailure = (
  activity: ActivityProgress,
  failedJob?: FailedJob,
): Failure | undefined => {
  if (failedJob) {
    return {
      jobId: failedJob.jobId ?? activity.jobId,
      errorMessage: activity.errorMessage ?? failedJob.exceptionMessage,
      attempts: activity.attempts ?? failedJob.attempts,
      firstFailedAt: activity.firstFailedAt ?? failedJob.firstFailedAt,
      lastFailedAt: activity.lastFailedAt ?? failedJob.lastFailedAt,
      reprocessCount: activity.reprocessCount ?? failedJob.reprocessCount,
      lastReprocessedAt:
        activity.lastReprocessedAt ?? failedJob.lastReprocessedAt,
      lastReprocessedBy: failedJob.lastReprocessedBy,
    };
  }
  if (!activity.errorMessage && !activity.jobId) return undefined;

  return {
    jobId: activity.jobId,
    errorMessage: activity.errorMessage,
    attempts: activity.attempts,
    firstFailedAt: activity.firstFailedAt,
    lastFailedAt: activity.lastFailedAt,
    reprocessCount: activity.reprocessCount,
    lastReprocessedAt: activity.lastReprocessedAt,
  };
};

const getReprocessingSummary = (job: FailedJobActionItem) =>
  [
    job.reprocessCount && job.reprocessCount > 0
      ? `${job.reprocessCount} ${job.reprocessCount === 1 ? "reprocessamento" : "reprocessamentos"}`
      : null,
    job.lastReprocessedAt
      ? `último em ${formatDateTime(job.lastReprocessedAt)}`
      : null,
    job.lastReprocessedBy ? `por ${job.lastReprocessedBy}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

const getStatus = (activity: ActivityProgress, isFailed: boolean) => {
  if (isFailed) return "Falhou";

  const status = activity.status?.toLowerCase() ?? "pending";
  return statusLabels[status] ?? activity.status ?? "Por iniciar";
};

const getStatusBadgeVariant = (
  activity: ActivityProgress,
  isFailed: boolean,
): NonNullable<ComponentProps<typeof IGRPBadgePrimitive>["variant"]> => {
  if (isFailed) return "destructive";

  const status = activity.status?.toLowerCase();
  if (status === "current") return "default";
  if (
    status === "completed" ||
    status === "retry" ||
    status === "retrying" ||
    status === "reprocessing"
  ) {
    return "secondary";
  }

  return "outline";
};

const toFailedJobActionItem = (
  activity: ActivityProgress,
  failure: Failure,
): FailedJobActionItem => ({
  id:
    failure.jobId ??
    activity.activityInstanceId ??
    activity.activityId ??
    activity.activityKey ??
    "unknown",
  jobId: failure.jobId,
  jobNumber: failure.jobId ?? "—",
  process: activity.activityKey ?? activity.activityId ?? "—",
  processName: activity.activityName ?? "Atividade não identificada",
  task: activity.activityName ?? activity.activityKey ?? "—",
  error: failure.errorMessage ?? "Erro não disponível.",
  attemptsLabel:
    failure.attempts === undefined
      ? "Tentativas não registadas"
      : `${failure.attempts} ${failure.attempts === 1 ? "tentativa" : "tentativas"}`,
  firstFailedAtLabel: formatDateTime(failure.firstFailedAt),
  lastFailedAtLabel: formatDateTime(failure.lastFailedAt),
  reprocessCount: failure.reprocessCount,
  lastReprocessedAt: failure.lastReprocessedAt,
  lastReprocessedBy: failure.lastReprocessedBy,
});

export function ActivityTimeline({
  activities = [],
  failedJobs = [],
  onRefresh,
}: {
  activities: ActivityProgress[];
  failedJobs: FailedJob[];
  onRefresh: () => Promise<unknown> | undefined;
}) {
  const { igrpToast } = useIGRPToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshProcess = async () => {
    setIsRefreshing(true);
    try {
      const result = await onRefresh();
      if (
        result &&
        typeof result === "object" &&
        "error" in result &&
        result.error
      ) {
        throw result.error;
      }
    } catch (error) {
      igrpToast({
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar os dados do processo.",
        type: "error",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const activityRows = useMemo(
    () =>
      activities.map((activity) => {
        const failedJob = failedJobs.find(
          (job) =>
            matchesId(job.jobId, activity.jobId) ||
            matchesId(job.activityId, activity.activityId) ||
            matchesId(job.activityId, activity.activityKey),
        );
        const isFailed = hasActiveFailure(activity, failedJob);
        return {
          activity,
          failedJob,
          isFailed,
          failure: isFailed ? getFailure(activity, failedJob) : undefined,
        };
      }),
    [activities, failedJobs],
  );

  const failedActivities = activityRows.filter(
    ({ failedJob, isFailed }) => isFailed && failedJob,
  );

  return (
    <FailedJobActionController onRetried={refreshProcess}>
      {({ openErrorDrawer, openRetryModal }) => (
        <section className="space-y-5">
          {failedActivities.length > 0 && (
            <IGRPAlertPrimitive variant="destructive">
              <CircleAlert aria-hidden="true" />
              <IGRPAlertTitlePrimitive>
                Parado · {failedActivities.length}{" "}
                {failedActivities.length === 1
                  ? "atividade esgotou"
                  : "atividades esgotaram"}{" "}
                as tentativas
              </IGRPAlertTitlePrimitive>
              <IGRPAlertDescriptionPrimitive>
                O processo segue em paralelo. As atividades paradas estão
                marcadas na lista.
              </IGRPAlertDescriptionPrimitive>
            </IGRPAlertPrimitive>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Atividades
              </h2>
              <IGRPButton
                name="refreshProcessTimeline"
                type="button"
                variant="outline"
                disabled={isRefreshing}
                onClick={() => void refreshProcess()}
              >
                <RefreshCw
                  className={isRefreshing ? "size-4 animate-spin" : "size-4"}
                  aria-hidden="true"
                />
                {isRefreshing ? "A atualizar…" : "Atualizar"}
              </IGRPButton>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                <thead className="border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-0 py-3">Atividade</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Início</th>
                    <th className="px-4 py-3">Responsável</th>
                  </tr>
                </thead>
                <tbody>
                  {activityRows.map(
                    ({ activity, failedJob, isFailed, failure }) => {
                      const status = getStatus(activity, isFailed);
                      const isRetrying = status === "A tentar de novo";
                      const assignee =
                        [
                          activity.userProfileAssignee?.email,
                          activity.userProfileAssignee?.fullName,
                          activity.assignee,
                          failedJob?.lastReprocessedBy,
                        ]
                          .map((value) => value?.trim())
                          .find(Boolean) ?? "—";
                      const failedJobAction = failure
                        ? toFailedJobActionItem(activity, failure)
                        : undefined;
                      const reprocessingSummary = failedJobAction
                        ? getReprocessingSummary(failedJobAction)
                        : "";

                      return (
                        <Fragment
                          key={
                            activity.activityInstanceId ??
                            activity.activityId ??
                            activity.activityKey
                          }
                        >
                          <tr
                            className={
                              isFailed
                                ? "border-b border-destructive/20 bg-destructive/5"
                                : isRetrying
                                  ? "border-b bg-muted/50"
                                  : "border-b"
                            }
                          >
                            <td className="px-0 py-3">
                              <p className="font-semibold text-foreground">
                                {activity.activityName ??
                                  activity.activityKey ??
                                  "—"}
                              </p>
                              <p className="font-mono text-xs text-muted-foreground">
                                {activity.activityKey ??
                                  activity.activityId ??
                                  "—"}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {activityTypeLabels[activity.type ?? ""] ??
                                activity.type ??
                                "—"}
                            </td>
                            <td className="px-4 py-3">
                              <IGRPBadgePrimitive
                                variant={getStatusBadgeVariant(
                                  activity,
                                  isFailed,
                                )}
                              >
                                {status}
                              </IGRPBadgePrimitive>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {formatTime(activity.startTime)}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {assignee}
                            </td>
                          </tr>
                          {failure && failedJobAction && (
                            <tr
                              className={
                                isFailed
                                  ? "border-b border-destructive/20 bg-destructive/5"
                                  : "border-b"
                              }
                            >
                              <td colSpan={5} className="p-0">
                                <div className="flex items-center justify-between gap-4 bg-background px-4 py-3">
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-destructive">
                                      {failedJobAction.error}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      {failedJobAction.attemptsLabel} · primeira
                                      falha {failedJobAction.firstFailedAtLabel}{" "}
                                      · última{" "}
                                      {failedJobAction.lastFailedAtLabel}
                                    </p>
                                    {reprocessingSummary && (
                                      <p className="mt-1 text-xs text-muted-foreground">
                                        {reprocessingSummary}
                                      </p>
                                    )}
                                  </div>
                                  {failure.jobId && (
                                    <div className="flex shrink-0 gap-4">
                                      <IGRPButton
                                        name={`viewActivityError-${failure.jobId}`}
                                        variant="outline"
                                        onClick={() =>
                                          void openErrorDrawer(failedJobAction)
                                        }
                                      >
                                        <Info
                                          className="size-4"
                                          aria-hidden="true"
                                        />
                                        Ver erro
                                      </IGRPButton>
                                      <IGRPButton
                                        name={`retryActivityJob-${failure.jobId}`}
                                        onClick={() =>
                                          openRetryModal(failedJobAction)
                                        }
                                      >
                                        <Zap
                                          className="size-4"
                                          aria-hidden="true"
                                        />
                                        Reprocessar…
                                      </IGRPButton>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    },
                  )}
                </tbody>
              </table>
              {activityRows.length === 0 && (
                <p className="py-8 text-center text-muted-foreground">
                  Nenhuma atividade encontrada.
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </FailedJobActionController>
  );
}
