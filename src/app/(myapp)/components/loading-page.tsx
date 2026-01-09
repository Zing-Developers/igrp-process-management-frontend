import { IGRPLoadingSpinner } from "@igrp/igrp-framework-react-design-system";

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
      <div className="flex items-center gap2 flex-col">
        <IGRPLoadingSpinner />
        <span> {message}</span>
      </div>
    );
  }
}

export { LoadingPage };
