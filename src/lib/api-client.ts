import { ProcessManagementClient } from "@igrp/platform-process-management-client-ts";
import { getIGRPProcessClientConfig } from "./api-config";
import { getAccessToken, refreshAccessToken } from "./auth-helpers";
import { LRUCache } from "lru-cache";
import { getOrFetchToken } from "./rsa-token-handlers";

const cache = new LRUCache<string, string>({
  max: 1,
  ttl: 1000 * 60 * 3,
});

let clientInstance: ProcessManagementClient | null = null;

export async function getIGRPProcessClient(): Promise<ProcessManagementClient> {
  // Always create a fresh client instance to ensure we have the latest configuration
  clientInstance = null;
  // Always get fresh config to ensure we have the latest token
  const { baseUrl, timeout = 45000 } = getIGRPProcessClientConfig();

  let token = await getAccessToken();

  // Check if token is missing or expired
  if (!token) {
    console.error("[API Client] No token available");
    throw new Error("Authentication token not available");
  }

  // Check if token is expired and refresh if needed
  if (token.expiresAt && token.expiresAt < Date.now()) {
    console.log("[API Client] Token expired, refreshing...");
    token = await refreshAccessToken(token);

    if (token.error) {
      console.error("[API Client] Failed to refresh token:", token.error);
      throw new Error("Failed to refresh authentication token");
    }
  }

  // Ensure we have an access token
  if (!token.accessToken) {
    console.error("[API Client] No access token in token object");
    throw new Error("Access token not available");
  }

  const IRN_APISIX_TOKEN_ENABLED =
    process.env.IRN_APISIX_TOKEN_ENABLED ?? false;

  const ROTATED_TOKEN = await getOrFetchToken("api-six-token-v.0", cache);

  // Prepare headers with authentication
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(IRN_APISIX_TOKEN_ENABLED
      ? {
          Authorization: `Bearer ${ROTATED_TOKEN}`,
          "X-Access-Token": `Bearer ${token?.accessToken}`,
          Cookie: `session_id=${token?.session_id}`,
        }
      : {
          Authorization: `Bearer ${token.accessToken}`,
          Cookie: `session_id=${token?.session_id}`,
        }),
  };

  // Create new client instance with current token
  clientInstance = ProcessManagementClient.create({
    baseUrl,
    timeout,
    headers,
  });

  return clientInstance;
}

export function resetIGRPProcessClient() {
  clientInstance = null;
}
