"use server";

import {
  createM2mKeysClient,
  M2mKeysApiClientError,
  type CreateM2mKeyRequest,
  type CreatedM2mKey,
  type M2mKey,
} from "@/app/(myapp)/client/m2m-keys";
import { getIGRPProcessApiRequestConfig } from "@/lib/api-client";

const getM2mKeysClient = async () =>
  createM2mKeysClient(await getIGRPProcessApiRequestConfig());

export type M2mKeysActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; status?: number };

const toResult = <T>(error: unknown): M2mKeysActionResult<T> => {
  if (error instanceof M2mKeysApiClientError) {
    return { success: false, error: error.message, status: error.status };
  }
  throw error;
};

export const getM2mKeys = async (): Promise<M2mKeysActionResult<M2mKey[]>> => {
  try {
    return {
      success: true,
      data: await (await getM2mKeysClient()).m2mKeys.list(),
    };
  } catch (error) {
    return toResult(error);
  }
};

export const createM2mKey = async (
  request: CreateM2mKeyRequest,
): Promise<M2mKeysActionResult<CreatedM2mKey>> => {
  try {
    return {
      success: true,
      data: await (await getM2mKeysClient()).m2mKeys.create(request),
    };
  } catch (error) {
    return toResult(error);
  }
};

export const revokeM2mKey = async (
  id: string,
): Promise<M2mKeysActionResult<void>> => {
  try {
    await (await getM2mKeysClient()).m2mKeys.revoke(id);
    return { success: true, data: undefined };
  } catch (error) {
    return toResult(error);
  }
};

export const rotateM2mKey = async (
  id: string,
): Promise<M2mKeysActionResult<CreatedM2mKey>> => {
  try {
    return {
      success: true,
      data: await (await getM2mKeysClient()).m2mKeys.rotate(id),
    };
  } catch (error) {
    return toResult(error);
  }
};
