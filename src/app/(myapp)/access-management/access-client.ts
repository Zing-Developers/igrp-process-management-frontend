import { createIRNAccessClient } from "@irn/irn-core-framework/server/access-client";
import { getAccessToken } from "@/lib/auth-helpers";
import type { AccessManagementClient } from "./types";

export async function getClientAccess(): Promise<AccessManagementClient> {
  const igrpAccessManagementApi = process.env.IGRP_ACCESS_MANAGEMENT_API || "";

  const session = await getAccessToken();

  if (!session?.accessToken) {
    throw new Error(
      "An authenticated session is required to access access-management APIs.",
    );
  }

  return createIRNAccessClient({
    token: session.accessToken,
    baseUrl: igrpAccessManagementApi,
  }) as unknown as AccessManagementClient;
}
