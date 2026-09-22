"use server";

import { getClientAccess } from "./access-client";
import type { Application } from "./types";

export async function getApplications(): Promise<Application[]> {
  const client = await getClientAccess();

  try {
    const result = await client.applications.getApplications();
    return result.data;
  } catch (error) {
    console.error("[apps] Não foi possível obter os dados:", error);
    throw error;
  }
}

export async function getApplication(appCode: string): Promise<Application> {
  const client = await getClientAccess();

  try {
    const result = await client.applications.getApplicationByCode(appCode);
    return result.data;
  } catch (error: unknown) {
    console.error("[apps] Não foi possível obter os dados:", error);
    throw error;
  }
}
