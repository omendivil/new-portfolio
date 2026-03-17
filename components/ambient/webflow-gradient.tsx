"use client";

/**
 * Webflow-inspired gradient with DIRECTIONAL grain (vertical striations).
 * Key insight from screenshot: it's not random noise — there are visible
 * vertical brushstrokes/curtain folds. The colors are near-solid, not
 * transparent washes. The texture is directional, not isotropic.
 *
 * Technique: Use feTurbulence with different x/y baseFrequency values
 * to create vertical streaks instead of uniform noise.
 */
export function WebflowGradient({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Base gradient — NEAR SOLID, bright colors like a painted wall */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background: `
            linear-gradient(135deg,
              var(--wf-solid-1) 0%,
              var(--wf-solid-2) 30%,
              var(--wf-solid-3) 60%,
              var(--wf-solid-4) 100%
            )
          `,
        }}
      />

      {/* Vertical striation grain — directional noise (high x freq, low y freq = vertical streaks) */}
      <div
        className="pointer-events-none absolute z-[1] wf-grain"
        aria-hidden="true"
        style={{
          top: "-100%",
          left: "-100%",
          width: "300%",
          height: "300%",
          opacity: 0.5,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4 0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='1.8' intercept='-0.2'/%3E%3CfeFuncG type='linear' slope='1.8' intercept='-0.2'/%3E%3CfeFuncB type='linear' slope='1.8' intercept='-0.2'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Second grain layer — finer vertical texture */}
      <div
        className="pointer-events-none absolute z-[1] wf-grain-2"
        aria-hidden="true"
        style={{
          top: "-100%",
          left: "-100%",
          width: "300%",
          height: "300%",
          opacity: 0.3,
          mixBlendMode: "soft-light",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.3 1.4' numOctaves='3' seed='5' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='2' intercept='-0.25'/%3E%3CfeFuncG type='linear' slope='2' intercept='-0.25'/%3E%3CfeFuncB type='linear' slope='2' intercept='-0.25'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Smooth fade out at bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-72"
        aria-hidden="true"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, color-mix(in oklab, var(--background) 30%, transparent) 40%, var(--background) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -8%); }
          20% { transform: translate(-12%, 4%); }
          30% { transform: translate(5%, -15%); }
          40% { transform: translate(-4%, 18%); }
          50% { transform: translate(-10%, 8%); }
          60% { transform: translate(10%, -4%); }
          70% { transform: translate(-2%, 12%); }
          80% { transform: translate(3%, -10%); }
          90% { transform: translate(-8%, 6%); }
        }
        .wf-grain {
          animation: grain 6s steps(10) infinite;
          will-change: transform;
        }
        .wf-grain-2 {
          animation: grain 6s steps(10) -3s infinite reverse;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .wf-grain, .wf-grain-2 {
            animation: none;
            transform: none;
            will-change: auto;
          }
        }
      `}</style>
    </div>
  );
}
