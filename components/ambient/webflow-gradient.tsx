"use client";

/**
 * Webflow-inspired gradient with animated grain.
 *
 * Technique from CSS-Tricks "Animated Grainy Texture":
 * 1. Noise layer is 300% x 300% (oversized)
 * 2. CSS keyframes translate it around in big jumps
 * 3. steps() makes jumps instant — no sliding
 * 4. Because it's oversized, you never see edges
 * 5. Result: grain appears to flicker/shimmer naturally
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

      {/* Animated grain — oversized layer that jumps around */}
      <div
        className="pointer-events-none absolute z-[1] wf-grain"
        aria-hidden="true"
        style={{
          top: "-100%",
          left: "-100%",
          width: "300%",
          height: "300%",
          opacity: 0.4,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='1.5' intercept='-0.15'/%3E%3CfeFuncG type='linear' slope='1.5' intercept='-0.15'/%3E%3CfeFuncB type='linear' slope='1.5' intercept='-0.15'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Second grain layer — different seed, slightly offset timing */}
      <div
        className="pointer-events-none absolute z-[1] wf-grain-2"
        aria-hidden="true"
        style={{
          top: "-100%",
          left: "-100%",
          width: "300%",
          height: "300%",
          opacity: 0.25,
          mixBlendMode: "hard-light",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' seed='7' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='2' intercept='-0.3'/%3E%3CfeFuncG type='linear' slope='2' intercept='-0.3'/%3E%3CfeFuncB type='linear' slope='2' intercept='-0.3'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Edge glow accents — blue glow on right is sacred */}
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
