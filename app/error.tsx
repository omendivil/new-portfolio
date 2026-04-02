"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        Something went wrong
      </p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-text">
        An unexpected error occurred
      </h1>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent/40 hover:text-accent"
      >
        Try again
      </button>
    </div>
  );
}
