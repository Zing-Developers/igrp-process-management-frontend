import {
  igrpGetAccessClient,
  igrpResetAccessClientConfig,
  igrpSetAccessClientConfig,
} from "@igrp/framework-next";
import { getAccessToken } from "@/lib/auth-helpers";
import type { AccessManagementClient } from "./types";

export async function getClientAccess(): Promise<AccessManagementClient> {
  const igrpAccessManagementApi = process.env.IGRP_ACCESS_MANAGEMENT_API || "";

  igrpResetAccessClientConfig();
  const session = await getAccessToken();

  if (session !== null) {
    igrpSetAccessClientConfig({
      token: session.accessToken as string,
      baseUrl: igrpAccessManagementApi,
    });
  }

  return (await igrpGetAccessClient()) as unknown as AccessManagementClient;
}
