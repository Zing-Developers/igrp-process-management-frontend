import { IRNSpinner } from "@irn/irn-backoffice-design-system";

function IgrpLoading({
  loading,
  message = "A carregar definições de processo...",
}: {
  loading: boolean;
  message?: string;
}) {
  if (!loading) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <IRNSpinner size="lg" />
      <span>{message}</span>
    </div>
  );
}

export { IgrpLoading };
