import { ProcessManagementClient } from "@igrp/platform-process-management-client-ts";
import { getIGRPProcessClientConfig } from "./api-config";
import { getAccessToken, refreshAccessToken } from "./auth-helpers";

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

  // Prepare headers with authentication
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token.accessToken}`,
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
