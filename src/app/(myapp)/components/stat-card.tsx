import { IGRPIcon } from "@igrp/igrp-framework-react-design-system";

function StatCard({
  icon,
  label,
  value,
  subvalue,
}: {
  icon: string;
  label: string;
  value?: string;
  subvalue?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <IGRPIcon iconName={icon} />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <div className="font-medium text-foreground">{value}</div>
      {subvalue && (
        <div className="text-xs text-muted-foreground mt-1">{subvalue}</div>
      )}
    </div>
  );
}

export { StatCard };
