"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#0a0a0a", color: "#e5e5e5" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "1rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#888" }}>
            Something went wrong
          </p>
          <h1 style={{ marginTop: "1rem", fontSize: "1.5rem", fontWeight: 600 }}>
            An unexpected error occurred
          </h1>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: "1.5rem", padding: "0.625rem 1.5rem", border: "1px solid #333", borderRadius: "9999px", background: "transparent", color: "#e5e5e5", cursor: "pointer", fontSize: "0.875rem" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
