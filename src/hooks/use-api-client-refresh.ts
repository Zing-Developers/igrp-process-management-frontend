"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { updateIGRPProcessClientToken } from "@/lib/api-config";

/**
 * Hook to automatically refresh the API client when the session changes
 * This ensures the API client always has the latest authentication token
 */
export function useApiClientRefresh() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      // Still loading, do nothing
      return;
    }

    if (status === "authenticated" && session?.accessToken) {
      console.log("Session authenticated, updating API client token");
      updateIGRPProcessClientToken(session.accessToken);
    } else if (status === "unauthenticated") {
      console.log("Session unauthenticated, resetting API client");
    }
  }, [session, status]);
}
