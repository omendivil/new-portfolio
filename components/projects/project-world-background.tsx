"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMotionPreference } from "@/lib/motion";

/* ── Per-project world color schemes ── */
const WORLD_THEMES: Record<string, { primary: number[]; secondary: number[]; accent: number[] }> = {
  "research-commander": {
    primary: [0.95, 0.45, 0.1],   // orange
    secondary: [0.15, 0.12, 0.3], // deep indigo
    accent: [1.0, 0.6, 0.2],      // amber glow
  },
  "arch-drift": {
    primary: [0.2, 0.85, 0.4],    // green
    secondary: [0.05, 0.12, 0.08],// dark forest
    accent: [0.3, 1.0, 0.5],      // bright green
  },
  "claude-notifier": {
    primary: [0.6, 0.3, 0.95],    // purple
    secondary: [0.1, 0.05, 0.2],  // deep violet
    accent: [0.7, 0.4, 1.0],      // lavender
  },
  "anime-ai-app": {
    primary: [0.95, 0.3, 0.5],    // pink
    secondary: [0.2, 0.05, 0.15], // dark rose
    accent: [1.0, 0.45, 0.65],    // hot pink
  },
  "atlas-chat": {
    primary: [0.3, 0.5, 0.95],    // blue
    secondary: [0.05, 0.1, 0.2],  // midnight
    accent: [0.4, 0.65, 1.0],     // sky blue
  },
};

const DEFAULT_THEME = WORLD_THEMES["research-commander"];

/* ── Vertex shader ── */
const VERT = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

/* ── Fragment shader: particle field + atmosphere ── */
const FRAG = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uPrimary;
  uniform vec3 uSecondary;
  uniform vec3 uAccent;
  uniform float uTransition; // 0..1 blend to new colors

  // Simplex-ish noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  // Grid/digital pattern
  float grid(vec2 uv, float scale) {
    vec2 g = fract(uv * scale);
    float lines = smoothstep(0.0, 0.02, g.x) * smoothstep(0.0, 0.02, g.y);
    return 1.0 - lines;
  }

  // Floating particles
  float particles(vec2 uv, float time) {
    float p = 0.0;
    for (float i = 0.0; i < 20.0; i++) {
      vec2 pos = vec2(
        hash(vec2(i, 0.0)),
        hash(vec2(0.0, i))
      );
      pos.x += sin(time * 0.3 + i * 1.7) * 0.15;
      pos.y += cos(time * 0.2 + i * 2.3) * 0.1;
      pos.y = fract(pos.y - time * 0.02 * (0.5 + hash(vec2(i, i)) * 0.5));
      float d = length(uv - pos);
      float size = 0.001 + hash(vec2(i * 3.7, i * 1.3)) * 0.002;
      p += smoothstep(size, 0.0, d) * (0.3 + 0.7 * hash(vec2(i, i * 2.0)));
    }
    return p;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float aspect = uResolution.x / uResolution.y;
    vec2 uvA = vec2(uv.x * aspect, uv.y);

    float t = uTime * 0.15;

    // Layered domain warping
    vec2 q = vec2(fbm(uvA * 2.0 + t * 0.3), fbm(uvA * 2.0 + vec2(5.2, 1.3) + t * 0.2));
    float f = fbm(uvA * 2.0 + q * 1.5);

    // Atmosphere gradient
    vec3 col = mix(uSecondary, uSecondary * 1.5, uv.y * 0.5);

    // Add warped fog with primary color
    col += uPrimary * f * 0.15;

    // Add subtle grid
    float g = grid(uvA + q * 0.1, 30.0);
    col += uPrimary * g * 0.03 * smoothstep(0.3, 0.7, f);

    // Add glow from center-bottom
    vec2 glowCenter = vec2(0.5 * aspect, 0.3);
    float glow = 1.0 / (1.0 + length(uvA - glowCenter) * 3.0);
    col += uAccent * glow * 0.08;

    // Add floating particles
    float p = particles(uv, uTime);
    col += uAccent * p * 0.8;

    // Subtle vignette
    float vig = 1.0 - length((uv - 0.5) * 1.3);
    col *= smoothstep(0.0, 0.7, vig);

    // Keep it dark — this is a background
    col *= 0.7;

    gl_FragColor = vec4(col, 1.0);
  }
`;

type ProjectWorldBackgroundProps = {
  projectId: string;
};

export function ProjectWorldBackground({ projectId }: ProjectWorldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef(performance.now());
  const currentThemeRef = useRef(WORLD_THEMES[projectId] ?? DEFAULT_THEME);
  const targetThemeRef = useRef(WORLD_THEMES[projectId] ?? DEFAULT_THEME);
  const blendRef = useRef(1.0);
  const { reduceMotion } = useMotionPreference();

  // Smoothly blend to new theme on project change
  useEffect(() => {
    targetThemeRef.current = WORLD_THEMES[projectId] ?? DEFAULT_THEME;
    blendRef.current = 0.0;
  }, [projectId]);

  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    glRef.current = gl;

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERT);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAG);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("Fragment shader error:", gl.getShaderInfoLog(fs));
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program;

    // Full-screen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const dpr = Math.min(window.devicePixelRatio, 1.5); // cap for perf
    const w = canvas.clientWidth * dpr;
    const h = canvas.clientHeight * dpr;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }, []);

  useEffect(() => {
    initGL();
    resize();
    startTimeRef.current = performance.now();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    function render() {
      const gl = glRef.current;
      const program = programRef.current;
      if (!gl || !program) return;

      resize();

      const elapsed = (performance.now() - startTimeRef.current) / 1000;

      // Blend themes smoothly
      if (blendRef.current < 1.0) {
        blendRef.current = Math.min(1.0, blendRef.current + 0.015);
        const b = blendRef.current;
        const cur = currentThemeRef.current;
        const tar = targetThemeRef.current;
        currentThemeRef.current = {
          primary: cur.primary.map((v, i) => v + (tar.primary[i] - v) * b) as [number, number, number],
          secondary: cur.secondary.map((v, i) => v + (tar.secondary[i] - v) * b) as [number, number, number],
          accent: cur.accent.map((v, i) => v + (tar.accent[i] - v) * b) as [number, number, number],
        };
      }

      const theme = currentThemeRef.current;

      gl.uniform1f(gl.getUniformLocation(program, "uTime"), reduceMotion ? 0 : elapsed);
      gl.uniform2f(gl.getUniformLocation(program, "uResolution"), gl.canvas.width, gl.canvas.height);
      gl.uniform3f(gl.getUniformLocation(program, "uPrimary"), ...theme.primary as [number, number, number]);
      gl.uniform3f(gl.getUniformLocation(program, "uSecondary"), ...theme.secondary as [number, number, number]);
      gl.uniform3f(gl.getUniformLocation(program, "uAccent"), ...theme.accent as [number, number, number]);
      gl.uniform1f(gl.getUniformLocation(program, "uTransition"), blendRef.current);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [initGL, resize, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ zIndex: 0 }}
    />
  );
}
