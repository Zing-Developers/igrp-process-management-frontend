import React from "react";
import { ExtendedArea } from "../types";
import { cn, IGRPIcon } from "@igrp/igrp-framework-react-design-system";

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
