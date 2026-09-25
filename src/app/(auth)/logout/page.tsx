"use client";

import { signOutIRN } from "@irn/irn-core-framework/client";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      await signOutIRN({ redirect: false });
    })();
  }, []);

  // TODO: apply design
  return <div>Logout in progress</div>;
}
