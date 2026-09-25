import { IGRPIcon } from "@igrp/igrp-framework-react-design-system";
import { cn } from "@irn/irn-backoffice-design-system";
import React from "react";

import type { BadgeVariant } from "../utils/status-helpers";

interface RecentItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: {
    text: string;
    variant?: BadgeVariant;
  };
}

const getBadgeClasses = (variant: string = "default") => {
  const variants = {
    success: "bg-green-100 text-green-800",
    warning: "bg-orange-100 text-orange-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    default: "bg-gray-100 text-gray-800",
  };
  return variants[variant as keyof typeof variants] || variants.default;
};

export function RecentItemsCard({
  title,
  iconName,
  items,
  emptyMessage = "Nenhum item disponível",
  onItemClick,
}: {
  title: string;
  iconName: string;
  items: RecentItem[];
  emptyMessage?: string;
  onItemClick?: (item: RecentItem) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <IGRPIcon iconName={iconName} size={20} className="text-gray-400" />
      </div>

      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={!onItemClick}
              className={cn(
                "flex w-full items-center justify-between rounded-lg bg-muted p-3 text-left",
                onItemClick &&
                  "cursor-pointer hover:bg-accent transition-colors",
              )}
              onClick={() => onItemClick?.(item)}
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {item.subtitle}
                </p>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full ml-3 shrink-0",
                    getBadgeClasses(item.badge.variant),
                  )}
                >
                  {item.badge.text}
                </span>
              )}
            </button>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-4">
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
}
