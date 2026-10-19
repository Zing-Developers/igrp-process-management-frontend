"use client";
import { IRNSpinner } from "@irn/irn-backoffice-design-system";
import { signInIRN } from "@irn/irn-core-framework/client";
import { useEffect } from "react";

/**
 * Close session in keycloak (primary credentials) from the client-side
 * use full when some credentials holder fails
 * @returns
 */
function RenegotiateSession() {
  useEffect(() => {
    signInIRN("keycloak", {
      redirect: true,
    });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center justify-center">
        <IRNSpinner size="lg" />
        <p className="mt-3 font-medium text-slate-600">Checking session, ...</p>
      </div>
    </div>
  );
}

export default RenegotiateSession;
