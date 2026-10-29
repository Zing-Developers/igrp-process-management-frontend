"use client";

import {
  IGRPButton,
  IGRPCopyTo,
  IGRPCSheetContentPrimitive,
  IGRPCSheetDescriptionPrimitive,
  IGRPCSheetFooterPrimitive,
  IGRPCSheetHeaderPrimitive,
  IGRPCSheetPrimitive,
  IGRPCSheetTitlePrimitive,
  IGRPInputText,
  IGRPModalDialog,
  IGRPModalDialogContent,
  IGRPModalDialogDescription,
  IGRPModalDialogFooter,
  IGRPModalDialogHeader,
  IGRPModalDialogTitle,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import { type ReactNode, useState } from "react";
import {
  getFailedJobStacktrace,
  retryFailedJob,
} from "@/app/(myapp)/client/failed-jobs";
import { formatTableDateTime } from "@/app/(myapp)/utils/table-date-time";

export type FailedJobActionItem = {
  id: string;
  jobId?: string;
  jobNumber: string;
  process: string;
  processName: string;
  task: string;
  error: string;
  attemptsLabel: string;
  firstFailedAtLabel: string;
  lastFailedAtLabel: string;
  reprocessCount?: number;
  lastReprocessedAt?: string;
  lastReprocessedBy?: string;
};

type FailedJobActionHandlers = {
  openErrorDrawer: (job: FailedJobActionItem) => Promise<void>;
  openRetryModal: (job: FailedJobActionItem) => void;
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function FailedJobActionController({
  children,
  onRetried,
}: {
  children: (handlers: FailedJobActionHandlers) => ReactNode;
  onRetried: () => Promise<unknown> | undefined;
}) {
  const { igrpToast } = useIGRPToast();
  const [selectedJob, setSelectedJob] = useState<FailedJobActionItem | null>(
    null,
  );
  const [stackTrace, setStackTrace] = useState("");
  const [stackTraceLoading, setStackTraceLoading] = useState(false);
  const [errorDrawerOpen, setErrorDrawerOpen] = useState(false);
  const [retryJob, setRetryJob] = useState<FailedJobActionItem | null>(null);
  const [retryModalOpen, setRetryModalOpen] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState("");
  const [retryAttemptsError, setRetryAttemptsError] = useState<string>();
  const [retrying, setRetrying] = useState(false);

  const openErrorDrawer = async (job: FailedJobActionItem) => {
    if (!job.jobId) {
      igrpToast({
        title: "Erro",
        description: "O identificador do job não está disponível.",
        type: "error",
      });
      return;
    }

    setSelectedJob(job);
    setStackTrace("");
    setStackTraceLoading(true);
    setErrorDrawerOpen(true);
    try {
      setStackTrace(await getFailedJobStacktrace(job.jobId));
    } catch (error) {
      setStackTrace(
        getErrorMessage(error, "Não foi possível carregar a stack trace."),
      );
    } finally {
      setStackTraceLoading(false);
    }
  };

  const openRetryModal = (job: FailedJobActionItem) => {
    if (!job.jobId) {
      igrpToast({
        title: "Erro",
        description: "O identificador do job não está disponível.",
        type: "error",
      });
      return;
    }

    setRetryJob(job);
    setRetryAttempts("");
    setRetryAttemptsError(undefined);
    setErrorDrawerOpen(false);
    setRetryModalOpen(true);
  };

  const confirmRetry = async () => {
    if (!retryJob?.jobId) return;

    const value = retryAttempts.trim();
    if (
      value &&
      (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 100)
    ) {
      setRetryAttemptsError("Introduza um número inteiro entre 1 e 100.");
      return;
    }

    setRetrying(true);
    try {
      await retryFailedJob(retryJob.jobId, value ? Number(value) : undefined);
      setRetryModalOpen(false);
      setRetryJob(null);
      igrpToast({
        title: "Job reprocessado",
        description: "O job foi devolvido à fila para reprocessamento.",
        type: "success",
      });
      await onRetried();
    } catch (error) {
      igrpToast({
        title: "Erro",
        description: getErrorMessage(
          error,
          "Não foi possível reprocessar o job.",
        ),
        type: "error",
      });
    } finally {
      setRetrying(false);
    }
  };

  const copyStackTrace = async () => {
    if (!stackTrace) return;

    try {
      await navigator.clipboard.writeText(stackTrace);
      igrpToast({
        title: "Copiado",
        description: "A stack trace foi copiada para a área de transferência.",
        type: "success",
      });
    } catch {
      igrpToast({
        title: "Erro",
        description: "Não foi possível copiar a stack trace.",
        type: "error",
      });
    }
  };

  return (
    <>
      {children({ openErrorDrawer, openRetryModal })}

      {selectedJob && (
        <IGRPCSheetPrimitive
          open={errorDrawerOpen}
          onOpenChange={setErrorDrawerOpen}
        >
          <IGRPCSheetContentPrimitive
            side="right"
            className="w-full gap-0 p-0 sm:max-w-[760px]"
          >
            <IGRPCSheetHeaderPrimitive className="border-b px-7 py-8 sm:px-8">
              <div className="flex items-start justify-between gap-4 pr-12">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Erro · Job {selectedJob.jobNumber}
                    <IGRPCopyTo
                      value={selectedJob.jobId ?? ""}
                      tooltipMessage="Copiar ID do job"
                      successMessage="ID do job copiado"
                    />
                  </div>
                  <IGRPCSheetTitlePrimitive className="text-xl font-bold tracking-tight">
                    {selectedJob.task}
                  </IGRPCSheetTitlePrimitive>
                  <IGRPCSheetDescriptionPrimitive className="text-base">
                    {selectedJob.task} · {selectedJob.process} ·{" "}
                    {selectedJob.processName}
                  </IGRPCSheetDescriptionPrimitive>
                </div>
              </div>
            </IGRPCSheetHeaderPrimitive>
            <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-7 py-8 sm:px-8">
              <div className="grid gap-7 sm:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Tentativas
                  </p>
                  <p className="text-base font-semibold">
                    {selectedJob.attemptsLabel}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Primeira falha
                  </p>
                  <p className="text-base font-semibold">
                    {selectedJob.firstFailedAtLabel}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Última falha
                  </p>
                  <p className="text-base font-semibold">
                    {selectedJob.lastFailedAtLabel}
                  </p>
                </div>
                {((selectedJob.reprocessCount ?? 0) > 0 ||
                  selectedJob.lastReprocessedAt ||
                  selectedJob.lastReprocessedBy) && (
                  <>
                    {selectedJob.reprocessCount !== undefined && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          Reprocessamentos manuais
                        </p>
                        <p className="text-base font-semibold">
                          {selectedJob.reprocessCount}
                        </p>
                      </div>
                    )}
                    {selectedJob.lastReprocessedAt && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          Último reprocessamento
                        </p>
                        <p className="text-base font-semibold">
                          {formatTableDateTime(selectedJob.lastReprocessedAt)}
                        </p>
                      </div>
                    )}
                    {selectedJob.lastReprocessedBy && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          Reprocessado por
                        </p>
                        <p className="text-base font-semibold">
                          {selectedJob.lastReprocessedBy}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
              <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Mensagem
                </h2>
                <p className="border border-[#bd3b22] px-5 py-7 text-base font-semibold leading-relaxed text-[#bd3b22]">
                  {selectedJob.error}
                </p>
              </section>
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Stack trace
                  </h2>
                  <IGRPButton
                    name="copyFailedJobStackTrace"
                    variant="outline"
                    onClick={copyStackTrace}
                    disabled={stackTraceLoading || !stackTrace}
                  >
                    Copiar
                  </IGRPButton>
                </div>
                <pre className="max-h-56 overflow-auto bg-muted p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {stackTraceLoading
                    ? "A carregar stack trace…"
                    : stackTrace || "Stack trace indisponível para este job."}
                </pre>
              </section>
            </div>
            <IGRPCSheetFooterPrimitive className="border-t px-7 py-5 sm:flex-row sm:justify-end sm:px-8">
              <IGRPButton
                name={`retryFailedJobDrawer-${selectedJob.id}`}
                onClick={() => openRetryModal(selectedJob)}
              >
                Reprocessar…
              </IGRPButton>
            </IGRPCSheetFooterPrimitive>
          </IGRPCSheetContentPrimitive>
        </IGRPCSheetPrimitive>
      )}

      {retryJob && (
        <IGRPModalDialog
          open={retryModalOpen}
          onOpenChange={(open) => {
            setRetryModalOpen(open);
            if (!open) setRetryAttemptsError(undefined);
          }}
        >
          <IGRPModalDialogContent size="xl" className="p-8 sm:p-10">
            <IGRPModalDialogHeader className="space-y-3 pr-8">
              <IGRPModalDialogTitle
                name="retryFailedJobTitle"
                className="text-xl font-bold tracking-tight"
              >
                Reprocessar {retryJob.task}?
              </IGRPModalDialogTitle>
              <IGRPModalDialogDescription
                name="retryFailedJobDescription"
                className="flex items-center gap-1 text-base"
              >
                {retryJob.process} · {retryJob.processName} · job{" "}
                {retryJob.jobNumber}
                <IGRPCopyTo
                  value={retryJob.jobId ?? ""}
                  tooltipMessage="Copiar ID do job"
                  successMessage="ID do job copiado"
                />
              </IGRPModalDialogDescription>
            </IGRPModalDialogHeader>
            <form
              className="space-y-8"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                void confirmRetry();
              }}
            >
              <section className="grid gap-x-8 gap-y-5 bg-muted p-6 sm:grid-cols-[minmax(190px,0.8fr)_minmax(0,1.6fr)]">
                <p className="text-base text-muted-foreground">Último erro</p>
                <p className="text-base font-semibold leading-relaxed text-[#bd3b22]">
                  {retryJob.error}
                </p>
                <p className="text-base text-muted-foreground">
                  Tentativas até agora
                </p>
                <p className="text-base font-semibold">
                  {retryJob.attemptsLabel}
                </p>
              </section>
              <p className="text-base leading-relaxed">
                O job volta à fila e corre em até 10 segundos. Confirme primeiro
                que o destino já responde: se voltar a falhar em todas as
                tentativas, regressa aos jobs falhados.
              </p>
              <div className="max-w-md">
                <IGRPInputText
                  id="retryAttempts"
                  type="number"
                  label="Tentativas para este reprocessamento"
                  placeholder="Valor do servidor"
                  value={retryAttempts}
                  onChange={(event) => {
                    setRetryAttempts(event.target.value);
                    setRetryAttemptsError(undefined);
                  }}
                  helperText="Entre 1 e 100. Vazio usa o valor configurado no servidor."
                  error={retryAttemptsError}
                />
              </div>
              <IGRPModalDialogFooter className="gap-3 sm:flex-row sm:justify-end">
                <IGRPButton
                  name="cancelRetryFailedJob"
                  type="button"
                  variant="outline"
                  onClick={() => setRetryModalOpen(false)}
                  disabled={retrying}
                >
                  Cancelar
                </IGRPButton>
                <IGRPButton
                  name={`confirmRetryFailedJob-${retryJob.id}`}
                  type="submit"
                  disabled={retrying}
                >
                  {retrying ? "A reprocessar…" : "Reprocessar"}
                </IGRPButton>
              </IGRPModalDialogFooter>
            </form>
          </IGRPModalDialogContent>
        </IGRPModalDialog>
      )}
    </>
  );
}
