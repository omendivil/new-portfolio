"use client";

/**
 * Webflow-inspired mesh gradient — smooth flowing color washes.
 * NOT discrete blobs. One div with multiple overlapping CSS gradients
 * that blend into each other like watercolor. Slowly shifts via CSS animation.
 */
export function MeshGradient() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[2]"
      aria-hidden="true"
      style={{
        background: `
          radial-gradient(ellipse 120% 80% at 15% 10%, var(--mesh-1), transparent 60%),
          radial-gradient(ellipse 100% 90% at 85% 15%, var(--mesh-2), transparent 55%),
          radial-gradient(ellipse 90% 70% at 50% 90%, var(--mesh-3), transparent 50%),
          radial-gradient(ellipse 80% 60% at 5% 70%, var(--mesh-4), transparent 55%),
          radial-gradient(ellipse 110% 50% at 70% 50%, var(--mesh-5), transparent 50%)
        `,
        animation: "mesh-shift 30s ease-in-out infinite alternate",
      }}
    >
      <style jsx>{`
        @keyframes mesh-shift {
          0% {
            filter: hue-rotate(0deg);
            transform: scale(1) translate(0, 0);
          }
          33% {
            transform: scale(1.02) translate(1%, -1%);
          }
          66% {
            transform: scale(0.98) translate(-1%, 1%);
          }
          100% {
            filter: hue-rotate(8deg);
            transform: scale(1.01) translate(0.5%, 0.5%);
          }
        }
      `}</style>
    </div>
  );
}
