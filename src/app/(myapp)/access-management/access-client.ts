import { getAccessToken } from '@/lib/auth-helpers';
import {
  igrpGetAccessClient,
  igrpResetAccessClientConfig,
  igrpSetAccessClientConfig,
} from '@igrp/framework-next';
import { AccessManagementClient } from '@igrp/platform-access-management-client-ts';

const IGRP_APP_MANAGER_API = process.env.IGRP_APP_MANAGER_API || '';

export async function getClientAccess(): Promise<AccessManagementClient> {
  igrpResetAccessClientConfig();
  const session = await getAccessToken();

  if (session !== null) {
    igrpSetAccessClientConfig({
      token: session.accessToken as string,
      baseUrl: IGRP_APP_MANAGER_API,
    });
  }

  return (await igrpGetAccessClient()) as unknown as AccessManagementClient;
}
