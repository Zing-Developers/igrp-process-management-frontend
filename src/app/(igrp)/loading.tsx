export default function Loading() {
  return (
    <output
      aria-label="Aguarde..."
      className="flex min-h-screen items-center justify-center"
    >
      <span className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </output>
  );
}
