export function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        opacity: "var(--noise-opacity)" as unknown as number,
        mixBlendMode: "var(--noise-blend)" as React.CSSProperties["mixBlendMode"],
        filter: "invert(var(--noise-invert))",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }}
      aria-hidden="true"
    />
  );
}
