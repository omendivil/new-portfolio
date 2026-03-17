"use client";

import { useMotionPreference } from "@/lib/motion";

/**
 * Drifting luminous particles — inspired by Raycast's star field.
 * Pure CSS keyframes on GPU-composited transforms for zero JS overhead.
 * Each particle has unique size, position, opacity, speed, and drift direction.
 */

interface Particle {
  id: number;
  x: number; // % from left
  y: number; // % from top (start position)
  size: number; // px
  opacity: number;
  duration: number; // seconds for full drift cycle
  delay: number; // animation delay
  drift: number; // horizontal drift amount in vw
}

// Deterministic particle layout — avoids hydration mismatch
function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  // Simple seeded pseudo-random (mulberry32)
  let seed = 42;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: 1 + rand() * 2.5,
      opacity: 0.15 + rand() * 0.5,
      duration: 18 + rand() * 30,
      delay: -(rand() * 40), // negative delay = start mid-animation
      drift: -3 + rand() * 6, // drift left or right
    });
  }
  return particles;
}

const PARTICLES = generateParticles(28);

export function FloatingParticles() {
  const { reduceMotion } = useMotionPreference();

  if (reduceMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            background:
              "radial-gradient(circle, var(--particle-color, rgba(255,255,255,0.8)), transparent 70%)",
            boxShadow: `0 0 ${p.size * 3}px ${p.size}px var(--particle-glow, rgba(138,201,189,0.15))`,
            animation: `particle-float ${p.duration}s linear ${p.delay}s infinite`,
            ["--p-drift" as string]: `${p.drift}vw`,
            /* will-change omitted — transform+opacity keyframes are compositor-only without it */
          }}
        />
      ))}

      <style jsx>{`
        @keyframes particle-float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(var(--p-drift));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
