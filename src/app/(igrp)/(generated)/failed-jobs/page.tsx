"use client";

import {
  cn,
  IGRPButton,
  IGRPDataTable,
  IGRPDataTableHeaderSortToggle,
  IGRPDataTableRowAction,
  IGRPInputText,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import type { FailedJob as FailedJobDto } from "@irn/platform-process-management-types";
import { CircleAlert, Info, LoaderCircle, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { FailedJobActionController } from "@/app/(myapp)/components/failed-job-action-controller";
import {
  type AppliedFilter,
  AppliedFiltersSection,
  FiltersSection,
} from "@/app/(myapp)/components/filter-section";
import { PageHeader } from "@/app/(myapp)/components/PageHeader";
import { getFailedJobs } from "@/app/(myapp)/client/failed-jobs";
import { formatTableDateTime } from "@/app/(myapp)/utils/table-date-time";

type FailedJob = FailedJobDto & {
  id: string;
  jobNumber: string;
  process: string;
  processName: string;
  task: string;
  error: string;
  attemptsLabel: string;
  firstFailedAtLabel: string;
  lastFailedAtLabel: string;
};

const toTableJob = (job: FailedJobDto): FailedJob => ({
  ...job,
  id:
    job.jobId ??
    job.executionId ??
    job.processInstanceId ??
    job.activityId ??
    "unknown",
  jobNumber: job.jobId ?? "—",
  process:
    job.processNumber ??
    job.engineProcessInstanceId ??
    job.processInstanceId ??
    "Processo não identificado",
  processName: job.processName ?? "Sem instância na app",
  task: job.activityId ?? "—",
  error: job.exceptionMessage ?? "Erro não disponível.",
  attemptsLabel:
    job.attempts === undefined
      ? "Tentativas não registadas"
      : `${job.attempts} ${job.attempts === 1 ? "tentativa" : "tentativas"}`,
  firstFailedAtLabel: formatTableDateTime(job.firstFailedAt),
  lastFailedAtLabel: formatTableDateTime(job.lastFailedAt),
  reprocessCount: job.reprocessCount,
  lastReprocessedAt: job.lastReprocessedAt,
  lastReprocessedBy: job.lastReprocessedBy,
});

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const PAGE_SIZE = 25;
const processInstanceIdSchema = z.string().trim().refine(
  (value) => value === "" || z.uuid().safeParse(value).success,
  "Introduza um UUID válido.",
);

export default function FailedJobsPage() {
  const { igrpToast } = useIGRPToast();
  const [draftProcessInstanceId, setDraftProcessInstanceId] = useState("");
  const [processInstanceIdError, setProcessInstanceIdError] = useState<string>();
  const [processInstanceId, setProcessInstanceId] = useState("");
  const [draftBusinessKey, setDraftBusinessKey] = useState("");
  const [businessKey, setBusinessKey] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [jobs, setJobs] = useState<FailedJob[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>();
  const latestRequestRef = useRef(0);

  const loadJobs = useCallback(async () => {
    const requestId = ++latestRequestRef.current;
    setLoading(true);
    setLoadError(undefined);
    try {
      const page = await getFailedJobs(
        processInstanceId || undefined,
        pageIndex,
        PAGE_SIZE,
        businessKey || undefined,
      );
      if (requestId !== latestRequestRef.current) return;
      if (pageIndex > 0 && pageIndex >= page.totalPages) {
        setPageIndex(Math.max(0, page.totalPages - 1));
        return;
      }
      setJobs((page.content ?? []).map(toTableJob));
      setTotalElements(page.totalElements);
      setTotalPages(page.totalPages);
    } catch (error) {
      if (requestId !== latestRequestRef.current) return;
      setJobs([]);
      setTotalElements(0);
      setTotalPages(0);
      const message = getErrorMessage(
        error,
        "Não foi possível carregar os jobs falhados.",
      );
      setLoadError(message);
      igrpToast({ title: "Erro", description: message, type: "error" });
    } finally {
      if (requestId === latestRequestRef.current) setLoading(false);
    }
  }, [processInstanceId, businessKey, pageIndex, igrpToast]);

  useEffect(() => {
    void loadJobs();
    return () => {
      latestRequestRef.current += 1;
    };
  }, [loadJobs]);

  const updateAppliedFilters = (
    nextProcessInstanceId: string,
    nextBusinessKey: string,
  ) => {
    if (
      nextProcessInstanceId === processInstanceId &&
      nextBusinessKey === businessKey &&
      pageIndex === 0
    ) {
      void loadJobs();
      return;
    }
    setProcessInstanceId(nextProcessInstanceId);
    setBusinessKey(nextBusinessKey);
    setPageIndex(0);
  };

  const applyFilter = () => {
    const parsedId = processInstanceIdSchema.safeParse(draftProcessInstanceId);
    if (!parsedId.success) {
      const message = parsedId.error.issues[0]?.message ?? "Introduza um UUID válido.";
      setProcessInstanceIdError(message);
      igrpToast({
        title: "Filtro inválido",
        description: message,
        type: "error",
      });
      return false;
    }

    setProcessInstanceIdError(undefined);
    updateAppliedFilters(parsedId.data, draftBusinessKey.trim());
    return true;
  };

  const clearFilters = () => {
    setDraftProcessInstanceId("");
    setProcessInstanceIdError(undefined);
    setDraftBusinessKey("");
    updateAppliedFilters("", "");
  };

  const appliedFilters: AppliedFilter[] = [
    ...(processInstanceId
      ? [
          {
            key: "processInstanceId",
            label: `Instância de processo: ${processInstanceId}`,
            onRemove: () => {
              setDraftProcessInstanceId("");
              setProcessInstanceIdError(undefined);
              setDraftBusinessKey(businessKey);
              updateAppliedFilters("", businessKey);
            },
          },
        ]
      : []),
    ...(businessKey
      ? [
          {
            key: "businessKey",
            label: `Business key: ${businessKey}`,
            onRemove: () => {
              setDraftProcessInstanceId(processInstanceId);
              setDraftBusinessKey("");
              updateAppliedFilters(processInstanceId, "");
            },
          },
        ]
      : []),
  ];

  return (
    <FailedJobActionController onRetried={loadJobs}>
      {({ openErrorDrawer, openRetryModal }) => (
        <main className={cn("page", "space-y-6")}>
          <PageHeader
            name="Jobs falhados"
            description="Tarefas assíncronas que esgotaram as tentativas. O processo fica parado nessa tarefa até o job ser reprocessado com sucesso."
            badgeCount={totalElements}
          />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span></span>
            <FiltersSection
              hasAppliedFilters={appliedFilters.length > 0}
              onApply={applyFilter}
              onClear={clearFilters}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <IGRPInputText
                  id="processInstanceId"
                  label="Instância de processo"
                  placeholder="UUID da instância (opcional)"
                  value={draftProcessInstanceId}
                  error={processInstanceIdError}
                  onChange={(event) => {
                    setDraftProcessInstanceId(event.target.value);
                    setProcessInstanceIdError(undefined);
                  }}
                />
                <IGRPInputText
                  id="businessKey"
                  label="Business key"
                  placeholder="Business key da instância (opcional)"
                  value={draftBusinessKey}
                  onChange={(event) => setDraftBusinessKey(event.target.value)}
                />
              </div>
            </FiltersSection>
          </div>
          <AppliedFiltersSection filters={appliedFilters} />
          <IGRPDataTable<FailedJob, FailedJob>
            id="failed-jobs"
            showFilter={false}
            showPagination={false}
            className={cn("border-0")}
            notFoundLabel={
              loading
                ? "A carregar jobs falhados…"
                : processInstanceId || businessKey
                  ? "Não existem jobs falhados para os filtros aplicados."
                  : "Não existem jobs falhados."
            }
            columns={[
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title="Processo"
                  />
                ),
                accessorKey: "process",
                cell: ({ row }) => (
                  <div>
                    <p className="font-semibold text-primary">
                      {row.original.process}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {row.original.processName}
                    </p>
                  </div>
                ),
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title="Tarefa"
                  />
                ),
                accessorKey: "task",
                cell: ({ row }) => (
                  <span className="font-mono text-base">
                    {row.original.task}
                  </span>
                ),
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title="Erro"
                  />
                ),
                accessorKey: "error",
                cell: ({ row }) => (
                  <div>
                    <div className="flex gap-2 font-semibold leading-snug text-[#bd3b22]">
                      <CircleAlert
                        className="mt-0.5 size-5 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{row.original.error}</span>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      {row.original.attemptsLabel}
                    </p>
                  </div>
                ),
              },
              {
                header: ({ column }) => (
                  <IGRPDataTableHeaderSortToggle
                    column={column}
                    title="Última falha"
                  />
                ),
                accessorKey: "lastFailedAt",
                cell: ({ row }) => <span>{row.original.lastFailedAtLabel}</span>,
              },
              {
                id: "actions",
                enableHiding: false,
                header: "Ações",
                cell: ({ row }) => (
                  <IGRPDataTableRowAction>
                    <div className="flex items-center gap-4">
                      <IGRPButton
                        name={`viewFailedJobError-${row.original.id}`}
                        variant="outline"
                        onClick={() => void openErrorDrawer(row.original)}
                        disabled={!row.original.jobId}
                      >
                        <Info className="size-4" aria-hidden="true" />
                        Ver erro
                      </IGRPButton>
                      <IGRPButton
                        name={`retryFailedJob-${row.original.id}`}
                        onClick={() => openRetryModal(row.original)}
                        disabled={!row.original.jobId}
                      >
                        <Zap className="size-4" aria-hidden="true" />
                        Reprocessar…
                      </IGRPButton>
                    </div>
                  </IGRPDataTableRowAction>
                ),
              },
            ]}
            clientFilters={[]}
            data={loading || loadError ? [] : jobs}
          />
          {!loadError && totalPages > 1 && (
            <nav
              className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
              aria-label="Paginação dos jobs falhados"
            >
              <p>
                {pageIndex * PAGE_SIZE + 1}–
                {Math.min((pageIndex + 1) * PAGE_SIZE, totalElements)} de{" "}
                {totalElements} jobs
              </p>
              <div className="flex items-center gap-3">
                <IGRPButton
                  name="previousFailedJobsPage"
                  type="button"
                  variant="outline"
                  disabled={loading || pageIndex === 0}
                  onClick={() => setPageIndex((current) => current - 1)}
                >
                  Anterior
                </IGRPButton>
                <span>
                  Página {pageIndex + 1} de {totalPages}
                </span>
                <IGRPButton
                  name="nextFailedJobsPage"
                  type="button"
                  variant="outline"
                  disabled={loading || pageIndex >= totalPages - 1}
                  onClick={() => setPageIndex((current) => current + 1)}
                >
                  Seguinte
                </IGRPButton>
              </div>
            </nav>
          )}
        </main>
      )}
    </FailedJobActionController>
  );
}
