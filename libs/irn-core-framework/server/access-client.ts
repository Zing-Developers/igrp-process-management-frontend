import { AccessManagementClient } from '@igrp/platform-access-management-client-ts';

export type IRNAccessClientConfig = {
  baseUrl: string;
  token: string;
  timeout?: number;
};

export function createIRNAccessClient({ baseUrl, token, timeout = 10000 }: IRNAccessClientConfig) {
  return AccessManagementClient.create({
    baseUrl,
    timeout,
    headers: { Authorization: `Bearer ${token}` },
  });
}
