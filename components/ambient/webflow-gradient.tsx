"use client";

import { useEffect, useRef } from "react";

import { useMotionPreference } from "@/lib/motion";

/**
 * WebGL shader gradient — flowing diagonal bars with grain and color shifting.
 * Inspired by Raycast's crystal effect: bold diagonal slashes with
 * internal light movement and grainy edges.
 * Uses a fragment shader with simplex noise for organic flow.
 */

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform vec3 u_color4;

  // Simplex-style noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // 3D bar — bright highlight center, dark shadow edges, like a rounded cylinder
  float bar3d(vec2 uv, float pos, float width, float angle) {
    float d = uv.x * cos(angle) + uv.y * sin(angle);
    float edge = smoothstep(pos, pos + width * 0.08, d) *
                 smoothstep(pos + width, pos + width - width * 0.08, d);
    // Internal 3D shading — bright center, dark edges
    float center = (d - pos) / width;
    float shading = 1.0 - pow(abs(center * 2.0 - 1.0), 2.0);
    return edge * shading;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float t = u_time * 0.1;
    float angle = 0.85;

    // Color shifting
    float shift = sin(t * 0.5) * 0.5 + 0.5;
    vec3 colA = mix(u_color1, u_color3, shift);
    vec3 colB = mix(u_color2, u_color4, shift);

    // 5 bars — pushed toward edges, away from center
    float b1 = bar3d(uv, -0.05 + sin(t * 0.3) * 0.03, 0.14, angle);
    float b2 = bar3d(uv, 0.12 + sin(t * 0.25 + 1.0) * 0.02, 0.11, angle);
    float b3 = bar3d(uv, 0.28 + sin(t * 0.2 + 2.0) * 0.03, 0.09, angle);
    float b4 = bar3d(uv, 0.75 + sin(t * 0.35 + 3.0) * 0.02, 0.10, angle);
    float b5 = bar3d(uv, 0.92 + sin(t * 0.28 + 4.0) * 0.03, 0.13, angle);

    // Color per bar
    vec3 barColor = vec3(0.0);
    barColor += b1 * mix(colA, colB, 0.1) * 1.0;
    barColor += b2 * mix(colA, colB, 0.3) * 0.85;
    barColor += b3 * mix(colA, colB, 0.5) * 0.7;
    barColor += b4 * mix(colB, colA, 0.3) * 0.8;
    barColor += b5 * mix(colB, colA, 0.1) * 0.95;

    // Specular highlight — a bright streak sliding along bars
    float diag = uv.x * cos(angle) + uv.y * sin(angle);
    float spec = pow(max(0.0, sin(diag * 6.0 - t * 1.5)), 8.0);
    float totalBars = max(max(max(b1, b2), max(b3, b4)), b5);
    barColor += spec * totalBars * vec3(0.25, 0.22, 0.2);

    // Grain
    float grain = snoise(gl_FragCoord.xy * 0.6) * 0.05;
    grain += snoise(gl_FragCoord.xy * 1.3 + t * 6.0) * 0.02;

    // Dark base
    vec3 dark = vec3(0.067, 0.063, 0.051);
    vec3 color = dark + barColor + grain;

    // Strong center clear zone — keeps terminal area clean
    float centerMask = smoothstep(0.0, 0.35, length(uv - vec2(0.5, 0.42)));
    color = mix(dark, color, centerMask);

    // Edge vignette
    float vig = 1.0 - smoothstep(0.5, 1.1, length(uv - vec2(0.5, 0.5)) * 1.3);
    color = mix(dark, color, vig);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function hexToGL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

export function WebflowGradient({ children }: { children?: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef(Date.now());
  const rafRef = useRef<number>(0);
  const { reduceMotion } = useMotionPreference();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;
    glRef.current = gl;

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERTEX_SHADER);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAGMENT_SHADER);
    gl.compileShader(fs);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program;

    // Fullscreen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    // Colors — teal set + warm sunset set
    const c1 = hexToGL("#2a8a80"); // teal
    const c2 = hexToGL("#1a6b65"); // dark teal
    const c3 = hexToGL("#a05828"); // warm orange
    const c4 = hexToGL("#8a2848"); // deep rose

    gl.uniform3f(gl.getUniformLocation(program, "u_color1"), ...c1);
    gl.uniform3f(gl.getUniformLocation(program, "u_color2"), ...c2);
    gl.uniform3f(gl.getUniformLocation(program, "u_color3"), ...c3);
    gl.uniform3f(gl.getUniformLocation(program, "u_color4"), ...c4);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(gl.getUniformLocation(program, "u_resolution"), w, h);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    startTimeRef.current = Date.now();

    const render = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      gl.uniform1f(gl.getUniformLocation(program, "u_time"), elapsed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduceMotion) {
        rafRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [reduceMotion]);

  return (
    <div className="relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        aria-hidden="true"
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
    </div>
  );
}
