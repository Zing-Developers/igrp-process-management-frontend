"use client";

import {
  cn,
  IGRPButton,
  IGRPIcon,
  IGRPPopoverContentPrimitive,
  IGRPPopoverPrimitive,
  IGRPPopoverTriggerPrimitive,
} from "@igrp/igrp-framework-react-design-system";
import { type ReactNode, useState } from "react";

export type AppliedFilter = {
  key: string;
  label: string;
  onRemove: () => void;
};

type FiltersSectionProps = {
  children: ReactNode;
  hasAppliedFilters?: boolean;
  onApply?: () => void;
  onClear?: () => void;
  title?: string;
};

type AppliedFiltersSectionProps = {
  filters: AppliedFilter[];
  className?: string;
  title?: string;
};

/**
 * Generic task-page filter dropdown. Pages provide their own filter controls
 * and callbacks, so this component is independent from a filter data model.
 */
export function FiltersSection({
  children,
  hasAppliedFilters = false,
  onApply,
  onClear,
  title = "Filtros",
}: FiltersSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-4 flex justify-end">
      <IGRPPopoverPrimitive open={isOpen} onOpenChange={setIsOpen}>
        <IGRPPopoverTriggerPrimitive asChild>
          <IGRPButton
            variant={hasAppliedFilters ? "default" : "outline"}
            showIcon={true}
            iconName="Filter"
          >
            {title}
          </IGRPButton>
        </IGRPPopoverTriggerPrimitive>
        <IGRPPopoverContentPrimitive
          side="bottom"
          align="end"
          sideOffset={8}
          collisionPadding={16}
          className="flex h-[min(42rem,var(--radix-popover-content-available-height))] w-[min(48rem,calc(100vw-2rem))] flex-col overflow-hidden p-0"
        >
          <div className="shrink-0 flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold">{title}</h3>
            <IGRPButton
              variant="ghost"
              size="icon"
              showIcon={true}
              iconName="X"
              aria-label="Fechar filtros"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
          <div className="shrink-0 flex flex-col-reverse gap-3 border-t p-4 sm:flex-row sm:justify-between">
            <IGRPButton
              variant="outline"
              onClick={() => {
                onClear?.();
                setIsOpen(false);
              }}
            >
              Limpar filtros
            </IGRPButton>
            <IGRPButton
              onClick={() => {
                onApply?.();
                setIsOpen(false);
              }}
            >
              Mostrar resultados
            </IGRPButton>
          </div>
        </IGRPPopoverContentPrimitive>
      </IGRPPopoverPrimitive>
    </div>
  );
}

/** Renders removable applied-filter chips supplied by the consuming page. */
export function AppliedFiltersSection({
  filters,
  className,
  title = "Filtros aplicados",
}: AppliedFiltersSectionProps) {
  if (filters.length === 0) return null;

  return (
    <section
      aria-label={title}
      className={cn(
        "mb-4 flex min-h-16 flex-wrap items-center gap-x-8 gap-y-3 rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 dark:border-neutral-700 dark:bg-neutral-900",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-3">
        <h3 className="text-base font-semibold text-slate-800 dark:text-neutral-200">
          {title}
        </h3>
        <span className="inline-flex size-5 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
          {filters.length}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={filter.onRemove}
            aria-label={`Remover filtro ${filter.label}`}
            className="group inline-flex h-9 max-w-full items-center gap-2 rounded-full bg-blue-100 py-1 pl-3 pr-1 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
          >
            <span className="truncate">{filter.label}</span>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-200 text-blue-700 transition-colors group-hover:bg-blue-300 dark:bg-blue-700 dark:text-blue-100 dark:group-hover:bg-blue-600">
              <IGRPIcon iconName="X" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
