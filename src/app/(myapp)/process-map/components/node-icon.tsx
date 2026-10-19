import { IGRPIcon } from "@igrp/igrp-framework-react-design-system";
import { cn } from "@irn/irn-backoffice-design-system";
import React from "react";
import type { ExtendedArea } from "../types";

interface NodeIconProps {
  node: ExtendedArea;
  isExpanded: boolean;
}

export function NodeIcon({ node, isExpanded }: NodeIconProps) {
  const { hasChildren } = node;

  switch (node.type) {
    case "area":
    case "subarea":
      return hasChildren ? (
        isExpanded ? (
          <IGRPIcon
            name={`icon1`}
            iconName={"FolderOpen"}
            size={18}
            className={cn(`text-primary`)}
          ></IGRPIcon>
        ) : (
          <IGRPIcon
            name={`icon1`}
            iconName={"Folder"}
            size={18}
            className={cn(`text-primary`)}
          ></IGRPIcon>
        )
      ) : (
        <IGRPIcon
          name={`icon1`}
          iconName={"FolderTree"}
          size={18}
          className={cn(`text-muted-foreground`)}
        ></IGRPIcon>
      );

    case "process":
      return (
        <IGRPIcon
          name={`icon1`}
          iconName={"Workflow"}
          size={18}
          className={cn(`text-muted-foreground`)}
        ></IGRPIcon>
      );
    default:
      return null;
  }
}
