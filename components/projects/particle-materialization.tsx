"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { useMotionPreference } from "@/lib/motion";

/* ── Per-project accent colors (matches world background) ── */
const PROJECT_COLORS: Record<string, [number, number, number]> = {
  "research-commander": [1.0, 0.5, 0.15],
  "arch-drift": [0.3, 0.9, 0.5],
  "claude-notifier": [0.65, 0.35, 1.0],
  "anime-ai-app": [1.0, 0.35, 0.55],
  "atlas-chat": [0.35, 0.55, 1.0],
};

const DEFAULT_COLOR: [number, number, number] = [0.5, 0.5, 0.5];

/* ── Shaders ── */
const vertexShader = `
  attribute vec3 aTarget;
  attribute vec3 aRandom;
  attribute float aDelay;

  uniform float uProgress;
  uniform float uTime;

  varying float vAlpha;
  varying float vRandom;

  // Simple 3D noise for turbulence
  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    float delay = aDelay;
    // Stagger: particles closer to center arrive first
    float staggeredProgress = clamp((uProgress - delay * 0.3) / 0.7, 0.0, 1.0);
    // Ease out cubic
    float t = 1.0 - pow(1.0 - staggeredProgress, 3.0);

    // Interpolate from scattered to target
    vec3 pos = mix(aRandom, aTarget, t);

    // Add turbulence during transition (digital jitter)
    float turbulence = (1.0 - t) * 0.3;
    pos.x += sin(uTime * 8.0 + aDelay * 100.0) * turbulence * 0.1;
    pos.y += cos(uTime * 6.0 + aDelay * 73.0) * turbulence * 0.1;
    pos.z += sin(uTime * 10.0 + aDelay * 51.0) * turbulence * 0.05;

    // Grid snap as particles settle (digital feel)
    float snapStrength = smoothstep(0.7, 0.95, t);
    float gridSize = 80.0;
    pos.xy = mix(pos.xy, floor(pos.xy * gridSize + 0.5) / gridSize, snapStrength * 0.5);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Point size: larger when scattered, smaller when settled
    float size = mix(4.5, 1.8, t);
    gl_PointSize = size * (350.0 / -mvPosition.z);

    gl_Position = projectionMatrix * mvPosition;

    // Alpha: fade in during assembly, flicker
    float flicker = 1.0 - 0.15 * step(0.97, hash(aDelay * 43758.5453 + uTime * 5.0));
    vAlpha = smoothstep(0.0, 0.15, staggeredProgress) * flicker;
    vRandom = aDelay;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uProgress;
  uniform float uTime;

  varying float vAlpha;
  varying float vRandom;

  void main() {
    // Square particle shape (digital, not organic)
    vec2 pc = gl_PointCoord - 0.5;
    float sq = max(abs(pc.x), abs(pc.y));
    if (sq > 0.45) discard;

    // Subtle scanline
    float scanline = 0.85 + 0.15 * step(0.5, fract(gl_FragCoord.y * 0.25));

    // Color: strong accent when scattered, fades as assembled
    float assemblyGlow = (1.0 - uProgress);
    vec3 col = uColor * (0.5 + assemblyGlow * 1.5);
    col *= scanline;

    // Bright core glow during assembly
    col += uColor * assemblyGlow * 0.8;

    // Fade particles out as they fully settle
    float settledFade = smoothstep(0.85, 1.0, uProgress);
    float alpha = vAlpha * mix(0.9, 0.15, settledFade);

    gl_FragColor = vec4(col, alpha);
  }
`;

/* ── Particle system component (inside R3F Canvas) ── */
const PARTICLE_COUNT = 40000;
const SPREAD = 15; // how far particles scatter (wider = more dramatic scatter)
const RECT_W = 4.0; // target rectangle width (in world units)
const RECT_H = 2.5; // target rectangle height

type ParticleFieldProps = {
  projectId: string;
  onMaterialized?: () => void;
};

function ParticleField({ projectId, onMaterialized }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(1);
  const prevProjectRef = useRef(projectId);
  const materializedRef = useRef(false);
  const { viewport } = useThree();

  const color = PROJECT_COLORS[projectId] ?? DEFAULT_COLOR;

  // Generate particle data
  const { geometry } = useMemo(() => {
    const targets = new Float32Array(PARTICLE_COUNT * 3);
    const randoms = new Float32Array(PARTICLE_COUNT * 3);
    const delays = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Target: distributed across a rectangle
      const tx = (Math.random() - 0.5) * RECT_W;
      const ty = (Math.random() - 0.5) * RECT_H;
      const tz = 0;
      targets[i * 3] = tx;
      targets[i * 3 + 1] = ty;
      targets[i * 3 + 2] = tz;

      // Random: scattered in the void
      randoms[i * 3] = (Math.random() - 0.5) * SPREAD * 2;
      randoms[i * 3 + 1] = (Math.random() - 0.5) * SPREAD * 2;
      randoms[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;

      // Delay based on distance from center (center assembles first)
      const dist = Math.sqrt(tx * tx + ty * ty) / Math.sqrt(RECT_W * RECT_W + RECT_H * RECT_H);
      delays[i] = dist;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(targets.slice(), 3));
    geo.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
    geo.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));

    return { geometry: geo };
  }, []);

  // On project change: scatter then reform
  useEffect(() => {
    if (prevProjectRef.current !== projectId) {
      // Scatter
      progressRef.current = 0;
      targetProgressRef.current = 1;
      materializedRef.current = false;
      prevProjectRef.current = projectId;
    }
  }, [projectId]);

  useFrame((_, delta) => {
    if (!materialRef.current) return;

    // Animate progress toward target (slower = more dramatic)
    const speed = 0.45;
    progressRef.current += (targetProgressRef.current - progressRef.current) * delta * speed;
    progressRef.current = Math.min(1, progressRef.current);

    materialRef.current.uniforms.uProgress.value = progressRef.current;
    materialRef.current.uniforms.uTime.value += delta;
    materialRef.current.uniforms.uColor.value.set(...color);

    // Notify parent when materialized
    if (progressRef.current > 0.95 && !materializedRef.current) {
      materializedRef.current = true;
      onMaterialized?.();
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(...color) },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Exported wrapper ── */
type ParticleMaterializationProps = {
  projectId: string;
  onMaterialized?: () => void;
};

export function ParticleMaterialization({
  projectId,
  onMaterialized,
}: ParticleMaterializationProps) {
  const { reduceMotion } = useMotionPreference();

  // Skip particles entirely if reduced motion
  if (reduceMotion) {
    onMaterialized?.();
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]}
        style={{ background: "transparent", width: "100%", height: "100%", position: "absolute", inset: 0 }}
      >
        <ParticleField
          projectId={projectId}
          onMaterialized={onMaterialized}
        />
      </Canvas>
    </div>
  );
}
