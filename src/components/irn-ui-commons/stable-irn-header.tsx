"use client";

import { IRNHeader } from "@irn/irn-backoffice-integration";
import type React from "react";
import { useRef } from "react";

type IRNHeaderProps = React.ComponentProps<typeof IRNHeader>;

/**
 * IRNHeader reloads user data and menu whenever `handlers` changes identity.
 * A server re-render deserializes a fresh handlers object, which can invoke the
 * server actions again. Preserve the initial reference for this mounted header.
 */
export function StableIRNHeader({ handlers, ...props }: IRNHeaderProps) {
  const handlersRef = useRef(handlers);

  return <IRNHeader handlers={handlersRef.current} {...props} />;
}
