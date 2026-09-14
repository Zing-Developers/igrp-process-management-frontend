"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StickyNote } from "lucide-react";
import { z } from "zod";
import {
  cn,
  IGRPAlertDialog,
  IGRPButton,
  IGRPInputPrimitive,
  IGRPInputText,
  IGRPInputTime,
  IGRPModalDialog,
  IGRPModalDialogContent,
  IGRPModalDialogDescription,
  IGRPModalDialogFooter,
  IGRPModalDialogHeader,
  IGRPModalDialogTitle,
  IGRPTextarea,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import { IRNDatePicker } from "@irn/irn-backoffice-design-system";
import type {
  EmailAccessMapping,
  EmailAccessMappingRequest,
  UserProfileDTO,
} from "@irn/platform-process-management-types";
import {
  createEmailAccessMapping,
  getEmailAccessMappings,
  revokeEmailAccessMapping,
  updateEmailAccessMapping,
} from "@/app/(myapp)/functions/email-access-mappings";
import { AccessDeniedPage } from "@/app/(myapp)/components/access-denied-page";
import { IgrpLoading } from "@/app/(myapp)/components/igrp-loading";
import { PageHeader } from "@/app/(myapp)/components/PageHeader";
import { UserCell } from "@/app/(myapp)/components/user-cell";

const QUERY_KEY = ["email-access-mappings"] as const;
const permissionPattern = /^[A-Z0-9_.]+:[a-z_]+$/;
const localTimePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

const permissionSuggestions = [
  "AREAS:visualizar",
  "PROCESS_DEFINITIONS:visualizar",
  "PROCESS_DEFINITIONS:publicar",
  "PROCESS_INSTANCES:visualizar",
  "PROCESS_INSTANCES:criar",
  "TASK_INSTANCES:visualizar",
  "TASK_INSTANCES:criar",
  "TASK_INSTANCES:pesquisar_todos",
] as const;

const mappingSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "O email é obrigatório.")
    .email("Introduza um email válido."),
  permissions: z
    .array(z.string())
    .min(1, "Adicione pelo menos uma permissão.")
    .refine(
      (values) => values.every(isValidPermission),
      "Use o formato MODULO:ação. Roles e grupos não são permitidos.",
    )
    .refine(
      (values) => new Set(values).size === values.length,
      "Não repita permissões.",
    ),
  description: z.string(),
  notes: z.string(),
  expiresAt: z.date().optional(),
  expirationTime: z.string(),
}).superRefine((values, context) => {
  if (values.expiresAt && !localTimePattern.test(values.expirationTime)) {
    context.addIssue({
      code: "custom",
      message: "Introduza uma hora válida.",
      path: ["expirationTime"],
    });
  }
});

type MappingFormValues = z.infer<typeof mappingSchema>;
type MappingFormErrors = Partial<Record<keyof MappingFormValues, string>>;
type MappingState = "active" | "expired" | "revoked";
type AccessErrorStatus = 401 | 403;

const isAccessErrorStatus = (status?: number): status is AccessErrorStatus =>
  status === 401 || status === 403;

function isValidPermission(permission: string): boolean {
  return (
    permissionPattern.test(permission) &&
    !permission.startsWith("ROLE_") &&
    !permission.startsWith("GROUP_")
  );
}

function parseLocalDateTime(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function expirationTimeFromApi(value?: string): string {
  return /T(\d{2}:\d{2})/.exec(value ?? "")?.[1] ?? "";
}

function toPickerDate(date?: Date): string | undefined {
  if (!date) return undefined;
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function fromPickerDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toApiLocalDateTime(
  date?: Date,
  time?: string,
): string | undefined {
  if (!date || !time) return undefined;
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${time}:00`;
}

function mappingState(
  mapping: EmailAccessMapping,
  now = new Date(),
): MappingState {
  if (mapping.active === false) return "revoked";
  const expiresAt = parseLocalDateTime(mapping.expiresAt);
  if (expiresAt && expiresAt.getTime() <= now.getTime()) return "expired";
  return "active";
}

function formatDateTime(value?: string): string {
  const date = parseLocalDateTime(value);
  if (!date) return "—";

  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function auditActor(
  profile?: UserProfileDTO,
  rawIdentifier?: string,
): UserProfileDTO | string | undefined {
  return profile ?? rawIdentifier;
}

function genericErrorMessage(): string {
  return "Não foi possível concluir o pedido. Tente novamente.";
}

export default function EmailAccessMappingsPage() {
  const queryClient = useQueryClient();
  const { igrpToast } = useIGRPToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingMapping, setEditingMapping] =
    useState<EmailAccessMapping | null>(null);
  const [revokingMapping, setRevokingMapping] =
    useState<EmailAccessMapping | null>(null);
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date>();
  const [expirationTime, setExpirationTime] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [permissionInput, setPermissionInput] = useState("");
  const [formErrors, setFormErrors] = useState<MappingFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const revokeInFlight = useRef(false);
  const reportedListError = useRef<string | null>(null);

  const mappingsQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getEmailAccessMappings,
  });
  const mappingsResult = mappingsQuery.data;
  const mappings = useMemo(
    () => (mappingsResult?.success ? mappingsResult.data : []),
    [mappingsResult],
  );

  const summary = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = now.getTime() + 30 * 24 * 60 * 60 * 1000;
    let active = 0;
    let expiring = 0;
    let revoked = 0;

    for (const mapping of mappings) {
      const state = mappingState(mapping, now);
      if (state === "revoked") {
        revoked += 1;
        continue;
      }
      if (state !== "active") continue;

      active += 1;
      const expiration = parseLocalDateTime(mapping.expiresAt);
      if (
        expiration &&
        expiration.getTime() > now.getTime() &&
        expiration.getTime() <= thirtyDaysFromNow
      ) {
        expiring += 1;
      }
    }

    return { active, expiring, revoked };
  }, [mappings]);

  const queryAccessErrorStatus =
    mappingsResult &&
    !mappingsResult.success &&
    isAccessErrorStatus(mappingsResult.status)
      ? mappingsResult.status
      : null;

  useEffect(() => {
    if (queryAccessErrorStatus) return;

    const errorMessage = mappingsQuery.isError
      ? genericErrorMessage()
      : mappingsResult && !mappingsResult.success
        ? mappingsResult.error
        : null;

    if (!errorMessage) {
      reportedListError.current = null;
      return;
    }
    if (reportedListError.current === errorMessage) return;

    reportedListError.current = errorMessage;
    igrpToast({ title: "Erro", description: errorMessage, type: "error" });
  }, [igrpToast, mappingsQuery.isError, mappingsResult, queryAccessErrorStatus]);

  const clearForm = () => {
    setEditingMapping(null);
    setEmail("");
    setDescription("");
    setNotes("");
    setExpiresAt(undefined);
    setExpirationTime("");
    setPermissions([]);
    setPermissionInput("");
    setFormErrors({});
  };

  const openCreateForm = () => {
    clearForm();
    setFormOpen(true);
  };

  const openEditForm = (mapping: EmailAccessMapping) => {
    setEditingMapping(mapping);
    setEmail(mapping.email ?? "");
    setDescription(mapping.description ?? "");
    setNotes(mapping.notes ?? "");
    setExpiresAt(parseLocalDateTime(mapping.expiresAt));
    setExpirationTime(expirationTimeFromApi(mapping.expiresAt));
    setPermissions(Array.from(new Set(mapping.permissions ?? [])));
    setPermissionInput("");
    setFormErrors({});
    setFormOpen(true);
  };

  const closeForm = () => {
    if (isSaving) return;
    setFormOpen(false);
    clearForm();
  };

  const addPermission = (rawPermission = permissionInput): boolean => {
    const permission = rawPermission.trim();
    if (!permission) return true;

    if (!isValidPermission(permission)) {
      setFormErrors((current) => ({
        ...current,
        permissions:
          "Use o formato MODULO:ação. Roles e grupos não são permitidos.",
      }));
      return false;
    }

    setPermissions((current) =>
      current.includes(permission) ? current : [...current, permission],
    );
    setPermissionInput("");
    setFormErrors((current) => ({ ...current, permissions: undefined }));
    return true;
  };

  const submitMapping = async () => {
    if (isSaving) return;

    const pendingPermission = permissionInput.trim();
    if (pendingPermission && !isValidPermission(pendingPermission)) {
      addPermission(pendingPermission);
      return;
    }

    const normalizedPermissions = Array.from(
      new Set([
        ...permissions,
        ...(pendingPermission ? [pendingPermission] : []),
      ]),
    );
    const parsed = mappingSchema.safeParse({
      email,
      permissions: normalizedPermissions,
      description,
      notes,
      expiresAt,
      expirationTime,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setFormErrors({
        email: fieldErrors.email?.[0],
        permissions: fieldErrors.permissions?.[0],
        description: fieldErrors.description?.[0],
        notes: fieldErrors.notes?.[0],
        expiresAt: fieldErrors.expiresAt?.[0],
        expirationTime: fieldErrors.expirationTime?.[0],
      });
      return;
    }

    const values = parsed.data;
    const request: EmailAccessMappingRequest = {
      email: editingMapping?.email ?? values.email,
      permissions: values.permissions,
      ...(values.description.trim()
        ? { description: values.description.trim() }
        : {}),
      ...(values.notes.trim() ? { notes: values.notes.trim() } : {}),
      ...(toApiLocalDateTime(values.expiresAt, values.expirationTime)
        ? {
            expiresAt: toApiLocalDateTime(
              values.expiresAt,
              values.expirationTime,
            ),
          }
        : {}),
    };

    setFormErrors({});
    setIsSaving(true);
    try {
      const result = editingMapping?.id
        ? await updateEmailAccessMapping(editingMapping.id, request)
        : await createEmailAccessMapping(request);

      if (!result.success) {
        igrpToast({ title: "Erro", description: result.error, type: "error" });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      const savedEmail = request.email ?? email;
      setFormOpen(false);
      clearForm();
      igrpToast({
        title: editingMapping ? "Mapeamento guardado" : "Acesso criado",
        description: editingMapping
          ? `As alterações a ${savedEmail} foram guardadas.`
          : `Acesso criado para ${savedEmail}.`,
        type: "success",
      });
    } catch {
      igrpToast({
        title: "Erro",
        description: genericErrorMessage(),
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const confirmRevoke = async () => {
    const mappingId = revokingMapping?.id;
    if (!mappingId || revokeInFlight.current) return;

    revokeInFlight.current = true;
    setIsRevoking(true);
    try {
      const result = await revokeEmailAccessMapping(mappingId);
      if (!result.success) {
        igrpToast({ title: "Erro", description: result.error, type: "error" });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      const revokedEmail = revokingMapping.email ?? "este email";
      setRevokingMapping(null);
      igrpToast({
        title: "Acesso revogado",
        description: `Acesso de ${revokedEmail} revogado.`,
        type: "success",
      });
    } catch {
      igrpToast({
        title: "Erro",
        description: genericErrorMessage(),
        type: "error",
      });
    } finally {
      revokeInFlight.current = false;
      setIsRevoking(false);
    }
  };

  if (queryAccessErrorStatus) {
    return (
      <AccessDeniedPage
        status={queryAccessErrorStatus}
        description={
          queryAccessErrorStatus === 401
            ? "A sua sessão não é válida ou expirou. Inicie sessão novamente para continuar."
            : "Não tem permissão para gerir mapeamentos de acesso por email."
        }
      />
    );
  }

  return (
    <div className={cn("page", "space-y-6")}>
      <div className={cn("section", "space-y-6")}>
        <PageHeader
          name="Mapeamentos de acesso por email"
          description="Sistemas externos com o seu próprio token Keycloak recebem as permissões mapeadas ao email do token."
          badgeCount={mappings.length}
        >
          <IGRPButton
            name="createEmailAccessMapping"
            showIcon
            iconName="Plus"
            onClick={openCreateForm}
          >
            Novo mapeamento
          </IGRPButton>
        </PageHeader>

        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryCard label="Activos" value={summary.active} />
          <SummaryCard
            label="A expirar em 30 dias"
            value={summary.expiring}
            tone="warning"
          />
          <SummaryCard
            label="Revogados"
            value={summary.revoked}
            tone="danger"
          />
        </div>

        <IgrpLoading
          loading={mappingsQuery.isLoading}
          message="A carregar mapeamentos…"
        />

        {mappingsQuery.isError && (
          <p className="text-sm text-destructive" role="alert">
            {genericErrorMessage()}
          </p>
        )}

        {mappingsResult && !mappingsResult.success && (
          <p className="text-sm text-destructive" role="alert">
            {mappingsResult.error}
          </p>
        )}

        {mappingsResult?.success && (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[1100px] text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Permissões</th>
                  <th className="p-3 font-medium">Estado</th>
                  <th className="p-3 font-medium">Expira</th>
                  <th className="p-3 font-medium">Criado</th>
                  <th className="p-3 font-medium">Última alteração</th>
                  <th className="p-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {mappings.map((mapping, index) => (
                  <MappingRow
                    key={mapping.id ?? `${mapping.email ?? "mapping"}-${index}`}
                    mapping={mapping}
                    onEdit={openEditForm}
                    onRevoke={setRevokingMapping}
                  />
                ))}
                {mappings.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-8 text-center text-muted-foreground"
                    >
                      Ainda não há mapeamentos neste backend.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <IGRPModalDialog
        open={formOpen}
        onOpenChange={(open) => {
          if (isSaving) return;
          if (open) setFormOpen(true);
          else closeForm();
        }}
      >
        <IGRPModalDialogContent size="lg">
          <IGRPModalDialogHeader>
            <IGRPModalDialogTitle name="emailAccessMappingFormTitle">
              {editingMapping ? "Editar mapeamento" : "Novo mapeamento"}
            </IGRPModalDialogTitle>
            <IGRPModalDialogDescription name="emailAccessMappingFormDescription">
              {editingMapping
                ? "Substitui permissões, descrição, notas e expiração. O email não muda; para outro endereço, crie um novo mapeamento."
                : "O email é o do service account no Keycloak. É guardado em minúsculas e não pode ser alterado depois da criação."}
            </IGRPModalDialogDescription>
          </IGRPModalDialogHeader>

          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void submitMapping();
            }}
          >
            <div className="grid gap-4 py-2">
              <IGRPInputText
                id="mappingEmail"
                type="email"
                label="Email do service account"
                placeholder="svc-fila@parceiro.cv"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFormErrors((current) => ({
                    ...current,
                    email: undefined,
                  }));
                }}
                error={formErrors.email}
                readOnly={Boolean(editingMapping)}
                disabled={isSaving}
                required
                inputClassName="font-mono"
              />

              <div className="space-y-2">
                <label
                  htmlFor="mappingPermission"
                  className="text-sm font-medium"
                >
                  Permissões <span aria-hidden="true">*</span>
                </label>
                <div
                  className={cn(
                    "flex min-h-10 flex-wrap items-center gap-2 rounded-md border bg-transparent px-3 py-2",
                    formErrors.permissions
                      ? "border-destructive"
                      : "border-input",
                  )}
                >
                  {permissions.map((permission) => (
                    <span
                      key={permission}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs"
                    >
                      {permission}
                      <button
                        type="button"
                        aria-label={`Remover permissão ${permission}`}
                        className="rounded-full px-0.5 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() =>
                          setPermissions((current) =>
                            current.filter((item) => item !== permission),
                          )
                        }
                        disabled={isSaving}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <IGRPInputPrimitive
                    id="mappingPermission"
                    value={permissionInput}
                    placeholder="MODULO:acao"
                    aria-invalid={Boolean(formErrors.permissions)}
                    aria-describedby="mappingPermissionHelp mappingPermissionError"
                    className="h-7 min-w-52 flex-1 border-0 px-0 shadow-none focus-visible:ring-0"
                    disabled={isSaving}
                    onChange={(event) => {
                      setPermissionInput(event.target.value);
                      setFormErrors((current) => ({
                        ...current,
                        permissions: undefined,
                      }));
                    }}
                    onBlur={() => {
                      if (permissionInput.trim()) addPermission();
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === ",") {
                        event.preventDefault();
                        addPermission();
                      } else if (
                        event.key === "Backspace" &&
                        !permissionInput &&
                        permissions.length
                      ) {
                        setPermissions((current) => current.slice(0, -1));
                      }
                    }}
                  />
                </div>
                <p
                  id="mappingPermissionHelp"
                  className="text-xs text-muted-foreground"
                >
                  Formato MODULO:acao. Roles e grupos são rejeitados.
                </p>
                {formErrors.permissions && (
                  <p
                    id="mappingPermissionError"
                    className="text-xs text-destructive"
                    role="alert"
                  >
                    {formErrors.permissions}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5" aria-label="Catálogo de permissões">
                  {permissionSuggestions.map((permission) => (
                    <button
                      key={permission}
                      type="button"
                      className="rounded-md border px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isSaving || permissions.includes(permission)}
                      onClick={() => addPermission(permission)}
                    >
                      {permission}
                    </button>
                  ))}
                </div>
              </div>

              <IGRPInputText
                id="mappingDescription"
                label="Descrição (opcional)"
                placeholder="Job da fila de trabalho"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                error={formErrors.description}
                disabled={isSaving}
              />

              <IGRPTextarea
                id="mappingNotes"
                label="Notas (opcional)"
                placeholder="Quem pediu, ticket, contacto do parceiro"
                helperText="Texto livre para a equipa. Nunca entra em nenhuma decisão de acesso."
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                error={formErrors.notes}
                disabled={isSaving}
              />

              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
                <div
                  className="space-y-2"
                  role="group"
                  aria-labelledby="mappingExpiresAtLabel"
                >
                  <div
                    id="mappingExpiresAtLabel"
                    className="text-sm font-medium"
                  >
                    Expira em (opcional)
                  </div>
                  <IRNDatePicker
                    mode="single"
                    value={toPickerDate(expiresAt)}
                    onChange={(value) => {
                      const date = fromPickerDate(value);
                      setExpiresAt(date);
                      if (date && !expirationTime) setExpirationTime("23:59");
                      setFormErrors((current) => ({
                        ...current,
                        expiresAt: undefined,
                        expirationTime: undefined,
                      }));
                    }}
                    placeholder="Selecione uma data"
                    disabled={isSaving}
                    align="start"
                    triggerClassName="w-full justify-between font-normal"
                    className="w-full"
                    applyLabel="Aplicar"
                    cancelLabel="Cancelar"
                  />
                  <div className="flex min-h-5 items-center justify-between gap-2">
                    
                    {expiresAt && (
                      <IGRPButton
                        name="clearEmailAccessExpiration"
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        disabled={isSaving}
                        onClick={() => {
                          setExpiresAt(undefined);
                          setExpirationTime("");
                          setFormErrors((current) => ({
                            ...current,
                            expiresAt: undefined,
                            expirationTime: undefined,
                          }));
                        }}
                      >
                        Limpar data
                      </IGRPButton>
                    )}
                  </div>
                </div>
                <IGRPInputTime
                  id="mappingExpirationTime"
                  label="Hora"
                  value={expirationTime}
                  onChange={(value) => {
                    setExpirationTime(value);
                    setFormErrors((current) => ({
                      ...current,
                      expirationTime: undefined,
                    }));
                  }}
                  error={formErrors.expirationTime}
                  disabled={isSaving || !expiresAt}
                  required={Boolean(expiresAt)}
                />
              </div>
            </div>

            <IGRPModalDialogFooter>
              <IGRPButton
                name="cancelEmailAccessMapping"
                variant="outline"
                onClick={closeForm}
                disabled={isSaving}
              >
                Cancelar
              </IGRPButton>
              <IGRPButton
                name="submitEmailAccessMapping"
                type="submit"
                loading={isSaving}
                loadingText={editingMapping ? "A guardar..." : "A criar..."}
                disabled={isSaving}
              >
                {editingMapping ? "Guardar" : "Criar"}
              </IGRPButton>
            </IGRPModalDialogFooter>
          </form>
        </IGRPModalDialogContent>
      </IGRPModalDialog>

      <IGRPAlertDialog
        open={Boolean(revokingMapping)}
        onOpenChange={(open) => {
          if (!open && !revokeInFlight.current) setRevokingMapping(null);
        }}
        title="Revogar este acesso?"
        description={`O sistema que usa ${revokingMapping?.email ?? "este email"} passa a receber 403 no próximo pedido. Não é possível anular esta ação; para voltar a dar acesso, crie um novo mapeamento. Fica registado quem revogou e quando.`}
        actionLabel={isRevoking ? "A revogar..." : "Revogar"}
        cancelLabel="Cancelar"
        showCancel
        variant="destructive"
        actionProps={{ disabled: isRevoking }}
        onAction={() => void confirmRevoke()}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "warning" | "danger";
}) {
  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div
        className={cn("mt-1 text-2xl font-semibold tabular-nums", {
          "text-amber-600 dark:text-amber-400": tone === "warning",
          "text-destructive": tone === "danger",
        })}
      >
        {value}
      </div>
    </div>
  );
}

function MappingRow({
  mapping,
  onEdit,
  onRevoke,
}: {
  mapping: EmailAccessMapping;
  onEdit: (mapping: EmailAccessMapping) => void;
  onRevoke: (mapping: EmailAccessMapping) => void;
}) {
  const [showAllPermissions, setShowAllPermissions] = useState(false);
  const [showAllDescription, setShowAllDescription] = useState(false);
  const state = mappingState(mapping);
  const revoked = state === "revoked";
  const hasId = Boolean(mapping.id);
  const mappingPermissions = mapping.permissions ?? [];
  const hasHiddenPermissions = mappingPermissions.length > 3;
  const visiblePermissions = showAllPermissions
    ? mappingPermissions
    : mappingPermissions.slice(0, 3);
  const descriptionCharacters = Array.from(mapping.description ?? "");
  const hasHiddenDescription = descriptionCharacters.length > 46;
  const visibleDescription = showAllDescription
    ? mapping.description
    : descriptionCharacters.slice(0, 46).join("");

  return (
    <tr className={cn("border-t align-top", revoked && "text-muted-foreground")}>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {mapping.email ?? "Email indisponível"}
          </span>
          {mapping.notes && (
            <span
              className="inline-flex rounded-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Notas: ${mapping.notes}`}
              title={mapping.notes}
              tabIndex={0}
            >
              <StickyNote className="size-4" aria-hidden="true" />
            </span>
          )}
        </div>
        {mapping.description && (
          <div className="mt-1 max-w-sm text-muted-foreground">
            <span>{visibleDescription}</span>
            {hasHiddenDescription && !showAllDescription && (
              <span aria-hidden="true">...</span>
            )}{" "}
            {hasHiddenDescription && (
              <button
                type="button"
                className="text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-expanded={showAllDescription}
                onClick={() => setShowAllDescription((current) => !current)}
              >
                {showAllDescription ? "Ver menos" : "Ver descrição completa"}
              </button>
            )}
          </div>
        )}
      </td>
      <td className="p-3">
        <div className="flex max-w-sm flex-wrap gap-1">
          {visiblePermissions.map((permission) => (
            <span
              key={permission}
              className="rounded-full bg-muted px-2 py-1 font-mono text-xs text-foreground"
            >
              {permission}
            </span>
          ))}
          {!mappingPermissions.length && (
            <span className="text-muted-foreground">—</span>
          )}
          {hasHiddenPermissions && (
            <button
              type="button"
              className="px-1 py-1 text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-expanded={showAllPermissions}
              aria-label={
                showAllPermissions
                  ? "Mostrar apenas as primeiras três permissões"
                  : `Mostrar todas as ${mappingPermissions.length} permissões`
              }
              onClick={() => setShowAllPermissions((current) => !current)}
            >
              {showAllPermissions ? "Ver menos" : "Ver todos"}
            </button>
          )}
        </div>
      </td>
      <td className="p-3">
        <StatusPill state={state} />
        {revoked && (
          <div className="mt-2 space-y-1 text-xs">
            <div>{formatDateTime(mapping.revokedAt)}</div>
            <UserCell
              user={auditActor(
                mapping.userProfileRevokedBy,
                mapping.revokedBy,
              )}
              className="text-sm"
            />
          </div>
        )}
      </td>
      <td className="whitespace-nowrap p-3">
        {mapping.expiresAt ? (
          formatDateTime(mapping.expiresAt)
        ) : (
          <span className="text-muted-foreground">sem expiração</span>
        )}
      </td>
      <td className="p-3">
        <AuditCell
          date={mapping.createdAt}
          user={auditActor(mapping.userProfileCreatedBy, mapping.createdBy)}
        />
      </td>
      <td className="p-3">
        <AuditCell
          date={mapping.updatedAt}
          user={auditActor(mapping.userProfileUpdatedBy, mapping.updatedBy)}
        />
      </td>
      <td className="p-3">
        <div className="flex justify-end gap-2">
          <IGRPButton
            name={`edit-email-access-${mapping.id ?? "unavailable"}`}
            variant="outline"
            size="sm"
            disabled={revoked || !hasId}
            onClick={() => onEdit(mapping)}
          >
            Editar
          </IGRPButton>
          <IGRPButton
            name={`revoke-email-access-${mapping.id ?? "unavailable"}`}
            variant="destructive"
            size="sm"
            disabled={revoked || !hasId}
            onClick={() => onRevoke(mapping)}
          >
            Revogar
          </IGRPButton>
        </div>
      </td>
    </tr>
  );
}

function AuditCell({
  date,
  user,
}: {
  date?: string;
  user?: UserProfileDTO | string;
}) {
  return (
    <div className="space-y-2">
      <div className="whitespace-nowrap">{formatDateTime(date)}</div>
      <UserCell user={user} className="text-sm" />
    </div>
  );
}

function StatusPill({ state }: { state: MappingState }) {
  const labels: Record<MappingState, string> = {
    active: "Activo",
    expired: "Expirado",
    revoked: "Revogado",
  };
  const classes: Record<MappingState, string> = {
    active:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
    expired:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
    revoked: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-1 text-xs font-medium",
        classes[state],
      )}
    >
      {labels[state]}
    </span>
  );
}
