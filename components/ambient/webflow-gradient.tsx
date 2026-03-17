"use client";

/**
 * Webflow-inspired gradient — the "getting much closer" version.
 * Three high-contrast noise layers with feComponentTransfer
 * for visible, punchy grain. This was the version right after
 * the dev server restart when the user said it was working.
 */
export function WebflowGradient({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Base gradient wash */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 130% 80% at 15% 20%, var(--wf-blue), transparent 55%),
            radial-gradient(ellipse 110% 90% at 85% 10%, var(--wf-lavender), transparent 50%),
            radial-gradient(ellipse 90% 70% at 55% 85%, var(--wf-teal), transparent 45%),
            radial-gradient(ellipse 80% 50% at 5% 65%, var(--wf-pink), transparent 50%),
            radial-gradient(ellipse 70% 45% at 90% 55%, var(--wf-indigo), transparent 45%)
          `,
        }}
      />

      {/* Noise layer 1 — high contrast, overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          opacity: 0.4,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='1.5' intercept='-0.15'/%3E%3CfeFuncG type='linear' slope='1.5' intercept='-0.15'/%3E%3CfeFuncB type='linear' slope='1.5' intercept='-0.15'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Noise layer 2 — coarser, hard-light for punch */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          opacity: 0.25,
          mixBlendMode: "hard-light",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.0' numOctaves='4' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='2' intercept='-0.3'/%3E%3CfeFuncG type='linear' slope='2' intercept='-0.3'/%3E%3CfeFuncB type='linear' slope='2' intercept='-0.3'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Noise layer 3 — fine grit */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          opacity: 0.15,
          mixBlendMode: "multiply",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='2' intercept='-0.3'/%3E%3CfeFuncG type='linear' slope='2' intercept='-0.3'/%3E%3CfeFuncB type='linear' slope='2' intercept='-0.3'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Edge glow accents */}
      <div
        className="pointer-events-none absolute -left-[15%] -top-[25%] z-0 h-[600px] w-[600px] rounded-full"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, var(--wf-edge-1), transparent 65%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-[20%] -right-[15%] z-0 h-[500px] w-[500px] rounded-full"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, var(--wf-edge-2), transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      {/* Fade out at bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32"
        aria-hidden="true"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--background))",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
