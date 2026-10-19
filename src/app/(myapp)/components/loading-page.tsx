import { IRNSpinner } from "@irn/irn-backoffice-design-system";

function LoadingPage({
  isLoading,
  error,
  message,
}: {
  isLoading: boolean;
  error?: boolean;
  message?: "loading";
}) {
  if (isLoading && !error) {
    return (
      <div className="flex flex-col items-center gap-2">
        <IRNSpinner size="lg" />
        <span> {message}</span>
      </div>
    );
  }
}

export { LoadingPage };
