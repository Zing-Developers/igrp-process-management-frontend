"use server";

import type {
  EmailAccessMapping,
  EmailAccessMappingRequest,
} from "@irn/platform-process-management-types";
import { getIGRPProcessClient } from "@/lib/api-client";

export type EmailAccessMappingsActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; status?: number };

const apiErrorMessage = (details: unknown): string | undefined => {
  if (typeof details === "string" && details.trim()) return details;
  if (!details || typeof details !== "object") return undefined;

  const payload = details as Record<string, unknown>;
  for (const key of ["error", "message", "detail"]) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) return value;
  }

  return undefined;
};

const getErrorResult = (
  error: unknown,
): EmailAccessMappingsActionResult<never> => {
  if (!error || typeof error !== "object") {
    return {
      success: false,
      error: "Não foi possível comunicar com a API. Tente novamente.",
    };
  }

  const apiError = error as {
    message?: unknown;
    status?: unknown;
    details?: unknown;
  };
  const detailMessage = apiErrorMessage(apiError.details);

  return {
    success: false,
    error:
      detailMessage ??
      (typeof apiError.message === "string"
        ? apiError.message
        : "Não foi possível comunicar com a API. Tente novamente."),
    ...(typeof apiError.status === "number" ? { status: apiError.status } : {}),
  };
};

export const getEmailAccessMappings = async (): Promise<
  EmailAccessMappingsActionResult<EmailAccessMapping[]>
> => {
  try {
    const client = await getIGRPProcessClient();
    const response = await client.emailAccessMappings.getEmailAccessMappings();
    return { success: true, data: response.data };
  } catch (error) {
    return getErrorResult(error);
  }
};

export const createEmailAccessMapping = async (
  request: EmailAccessMappingRequest,
): Promise<EmailAccessMappingsActionResult<EmailAccessMapping>> => {
  try {
    const client = await getIGRPProcessClient();
    const response =
      await client.emailAccessMappings.createEmailAccessMapping(request);
    return { success: true, data: response.data };
  } catch (error) {
    return getErrorResult(error);
  }
};

export const updateEmailAccessMapping = async (
  id: string,
  request: EmailAccessMappingRequest,
): Promise<EmailAccessMappingsActionResult<EmailAccessMapping>> => {
  try {
    const client = await getIGRPProcessClient();
    const response = await client.emailAccessMappings.updateEmailAccessMapping(
      id,
      request,
    );
    return { success: true, data: response.data };
  } catch (error) {
    return getErrorResult(error);
  }
};

export const revokeEmailAccessMapping = async (
  id: string,
): Promise<EmailAccessMappingsActionResult<void>> => {
  try {
    const client = await getIGRPProcessClient();
    await client.emailAccessMappings.revokeEmailAccessMapping(id);
    return { success: true, data: undefined };
  } catch (error) {
    return getErrorResult(error);
  }
};
