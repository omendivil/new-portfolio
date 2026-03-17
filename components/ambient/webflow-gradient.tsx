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

  // 3D bar — thick, compact
  float bar3d(float d, float pos, float width) {
    float edge = smoothstep(pos, pos + width * 0.05, d) *
                 smoothstep(pos + width, pos + width - width * 0.05, d);
    float center = (d - pos) / width;
    float shading = 1.0 - pow(abs(center * 2.0 - 1.0), 1.5);
    return edge * shading;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float t = u_time * 0.1;
    float angle = 0.85;
    float diag = uv.x * cos(angle) + uv.y * sin(angle);

    // Bright teal palette with color shift
    float shift = sin(t * 0.4) * 0.5 + 0.5;
    vec3 teal1 = vec3(0.18, 0.60, 0.55);
    vec3 teal2 = vec3(0.12, 0.48, 0.44);
    vec3 bright = vec3(0.30, 0.75, 0.70);
    vec3 colA = mix(teal1, bright, shift);
    vec3 colB = mix(teal2, vec3(0.6, 0.3, 0.15), shift * 0.25);

    // Thick compact bars — tight spacing, bigger widths
    float bars[12];
    bars[0]  = bar3d(diag, -0.08, 0.10);
    bars[1]  = bar3d(diag, 0.04,  0.11);
    bars[2]  = bar3d(diag, 0.17,  0.10);
    bars[3]  = bar3d(diag, 0.29,  0.11);
    bars[4]  = bar3d(diag, 0.42,  0.10);
    bars[5]  = bar3d(diag, 0.54,  0.11);
    bars[6]  = bar3d(diag, 0.66,  0.10);
    bars[7]  = bar3d(diag, 0.78,  0.11);
    bars[8]  = bar3d(diag, 0.90,  0.10);
    bars[9]  = bar3d(diag, 1.02,  0.11);
    bars[10] = bar3d(diag, 1.14,  0.10);
    bars[11] = bar3d(diag, 1.26,  0.11);

    // Color each bar
    vec3 allBars = vec3(0.0);
    for (int i = 0; i < 12; i++) {
      float mix_f = float(i) / 11.0;
      vec3 c = mix(colA, colB, mix_f + sin(t * 0.3 + mix_f * 3.0) * 0.15);
      allBars += bars[i] * c;
    }

    // Specular
    float spec = pow(max(0.0, sin(diag * 8.0 - t * 1.2)), 10.0) * 0.12;
    float totalBar = 0.0;
    for (int i = 0; i < 12; i++) totalBar += bars[i];
    allBars += spec * min(totalBar, 1.0) * bright;

    // REVEAL BLOB — bars only visible where the blob is
    // Two blobs orbiting in wavy organic paths
    vec2 blob1Pos = vec2(
      0.3 + sin(t * 0.35) * 0.3 + cos(t * 0.15) * 0.15,
      0.3 + cos(t * 0.25) * 0.25 + sin(t * 0.18) * 0.1
    );
    vec2 blob2Pos = vec2(
      0.7 + cos(t * 0.3) * 0.25 + sin(t * 0.2) * 0.1,
      0.6 + sin(t * 0.28) * 0.2 + cos(t * 0.22) * 0.15
    );

    float reveal1 = exp(-2.5 * length((uv - blob1Pos) * vec2(1.0, 1.4)));
    float reveal2 = exp(-3.0 * length((uv - blob2Pos) * vec2(1.2, 1.0)));
    float reveal = min(reveal1 + reveal2, 1.0);

    // Grain
    float grain = snoise(gl_FragCoord.xy * 0.6) * 0.04;
    grain += snoise(gl_FragCoord.xy * 1.3 + t * 6.0) * 0.02;

    // Compose: dark base, bars revealed by blob only
    vec3 dark = vec3(0.067, 0.063, 0.051);
    vec3 color = dark + allBars * reveal * 0.85 + grain;

    // Subtle ambient glow from blobs even where no bars
    color += reveal1 * teal1 * 0.08;
    color += reveal2 * teal2 * 0.06;

    // Center still slightly protected
    float centerMask = smoothstep(0.0, 0.2, length(uv - vec2(0.5, 0.42)));
    color = mix(dark + grain, color, centerMask * 0.85 + 0.15);

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
