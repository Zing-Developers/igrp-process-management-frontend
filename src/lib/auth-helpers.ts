import { reissueJwtClaims } from "@irn/irn-auth-sdk/server";
import type { NextApiRequest } from "next";
import { cookies } from "next/headers";
import { getToken, type JWT } from "next-auth/jwt";

const NEXTAUTH_SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
const refreshesInFlight = new Map<string, Promise<JWT>>();

export async function getAccessToken() {
  const cookieStore = await cookies();

  const token = await getToken({
    req: {
      cookies: Object.fromEntries(
        cookieStore.getAll().map((c) => [c.name, c.value]),
      ),
    } as NextApiRequest,
    secret: process.env.NEXTAUTH_SECRET || "",
  });

  return token;
}

/**
 * Returns a usable token and persists refresh-token rotation in the NextAuth
 * cookie before the Server Action response is sent back to the browser.
 */
export async function getValidAccessToken(): Promise<JWT | null> {
  const token = await getAccessToken();

  if (!token || !token.expiresAt || token.expiresAt >= Date.now()) {
    return token;
  }

  const refreshedToken = await refreshAccessToken(token);
  if (refreshedToken.error) return refreshedToken;

  await reissueJwtClaims(
    {
      accessToken: refreshedToken.accessToken,
      refreshToken: refreshedToken.refreshToken,
      expiresAt: refreshedToken.expiresAt,
      error: undefined,
      errorCode: undefined,
    },
    { maxAgeSeconds: NEXTAUTH_SESSION_MAX_AGE_SECONDS },
  );

  return refreshedToken;
}

/**
 * Refreshes the access token using the refresh token from Keycloak
 * @param token The JWT token to refresh
 * @returns Promise with refreshed token data
 */
export async function refreshAccessToken(token: JWT): Promise<JWT> {
  const refreshKey = String(token.session_id ?? token.refreshToken ?? "");
  const refreshInFlight = refreshesInFlight.get(refreshKey);
  if (refreshInFlight) return refreshInFlight;

  const refreshPromise = performTokenRefresh(token);
  refreshesInFlight.set(refreshKey, refreshPromise);

  try {
    return await refreshPromise;
  } finally {
    refreshesInFlight.delete(refreshKey);
  }
}

async function performTokenRefresh(token: JWT): Promise<JWT> {
  try {
    const issuer = process.env.KEYCLOAK_ISSUER;
    const clientId = process.env.KEYCLOAK_CLIENT_ID;
    const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

    if (!issuer || !clientId || !clientSecret) {
      console.error("[Auth] Missing Keycloak configuration for token refresh");
      return { ...token, error: "RefreshAccessTokenError" };
    }

    const refreshResponse = await fetch(
      `${issuer}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "refresh_token",
          refresh_token: token.refreshToken || "",
        }),
      },
    );

    const bodyText = await refreshResponse.text();

    if (!refreshResponse.ok) {
      console.error(
        "[Auth] Failed to refresh token:",
        refreshResponse.status,
        bodyText,
      );
      throw new Error(bodyText || `Refresh failed: ${refreshResponse.status}`);
    }

    const refreshedTokens = JSON.parse(bodyText);
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      error: undefined,
    };
  } catch (error) {
    console.error("[Auth] Error refreshing token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export async function signOut(token: JWT) {
  if (token.refreshToken) {
    try {
      const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_CLIENT_ID!,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
          refresh_token: token.refreshToken as string,
        }),
      });
    } catch (error) {
      console.error("Error revoking token", error);
    }
  }
}
