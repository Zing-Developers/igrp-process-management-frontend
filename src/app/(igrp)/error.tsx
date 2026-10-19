"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-xl space-y-4 text-center">
        <h1 className="text-2xl font-bold">Ocorreu um erro inesperado.</h1>
        <p className="text-muted-foreground">
          {error.message ||
            "A nossa equipa foi notificada e está a trabalhar para resolver o problema."}
        </p>
        {error.digest && (
          <code className="text-xs">ID de referência: {error.digest}</code>
        )}
        <div>
          <button
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            onClick={reset}
            type="button"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </main>
  );
}
