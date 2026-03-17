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

  // Smooth fBM — only 2 octaves for gentle, relaxed movement
  float fbm(vec2 p) {
    float val = 0.0;
    val += snoise(p) * 0.6;
    val += snoise(p * 2.0) * 0.3;
    return val;
  }

  // Gentle domain warping — low warp strength (1.5 not 4.0)
  float warpedNoise(vec2 p, float t) {
    vec2 q = vec2(
      fbm(p + vec2(0.0, 0.0) + t * 0.03),
      fbm(p + vec2(5.2, 1.3) + t * 0.025)
    );
    return fbm(p + 1.5 * q);
  }

  // 3D bar — thick, compact
  float bar3d(float d, float pos, float width) {
    float edge = smoothstep(pos, pos + width * 0.05, d) *
                 smoothstep(pos + width, pos + width - width * 0.05, d);
    float center = (d - pos) / width;
    float cx = abs(center * 2.0 - 1.0);
    float shading = 1.0 - cx * sqrt(cx);
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

    // Thick bars — touching, no gaps (unrolled for WebGL1 compat)
    float b0  = bar3d(diag, -0.10, 0.14);
    float b1  = bar3d(diag, 0.05,  0.14);
    float b2  = bar3d(diag, 0.20,  0.14);
    float b3  = bar3d(diag, 0.35,  0.14);
    float b4  = bar3d(diag, 0.50,  0.14);
    float b5  = bar3d(diag, 0.65,  0.14);
    float b6  = bar3d(diag, 0.80,  0.14);
    float b7  = bar3d(diag, 0.95,  0.14);
    float b8  = bar3d(diag, 1.10,  0.14);
    float b9  = bar3d(diag, 1.25,  0.14);
    float b10 = bar3d(diag, 1.40,  0.14);
    float b11 = bar3d(diag, 1.55,  0.14);

    // Color each bar — unrolled
    vec3 allBars = vec3(0.0);
    allBars += b0  * mix(colA, colB, 0.0  + sin(t*0.3)*0.15);
    allBars += b1  * mix(colA, colB, 0.09 + sin(t*0.3+0.27)*0.15);
    allBars += b2  * mix(colA, colB, 0.18 + sin(t*0.3+0.55)*0.15);
    allBars += b3  * mix(colA, colB, 0.27 + sin(t*0.3+0.82)*0.15);
    allBars += b4  * mix(colA, colB, 0.36 + sin(t*0.3+1.09)*0.15);
    allBars += b5  * mix(colA, colB, 0.45 + sin(t*0.3+1.36)*0.15);
    allBars += b6  * mix(colA, colB, 0.55 + sin(t*0.3+1.64)*0.15);
    allBars += b7  * mix(colA, colB, 0.64 + sin(t*0.3+1.91)*0.15);
    allBars += b8  * mix(colA, colB, 0.73 + sin(t*0.3+2.18)*0.15);
    allBars += b9  * mix(colA, colB, 0.82 + sin(t*0.3+2.45)*0.15);
    allBars += b10 * mix(colA, colB, 0.91 + sin(t*0.3+2.73)*0.15);
    allBars += b11 * mix(colA, colB, 1.0  + sin(t*0.3+3.0)*0.15);

    // Specular
    float totalBar = b0+b1+b2+b3+b4+b5+b6+b7+b8+b9+b10+b11;
    float spec = pow(max(1e-4, sin(diag * 8.0 - t * 1.2)), 10.0) * 0.12;
    allBars += spec * min(totalBar, 1.0) * bright;

    // BLOB POSITIONS — full coverage left to right
    // One blob biased left, one right, two roaming wide
    vec2 h1 = vec2(
      0.3 + warpedNoise(vec2(0.0, 0.0), t * 0.15) * 0.5,
      0.5 + warpedNoise(vec2(3.0, 7.0), t * 0.15) * 0.5
    );
    vec2 h2 = vec2(
      0.7 + warpedNoise(vec2(10.0, 5.0), t * 0.12) * 0.5,
      0.5 + warpedNoise(vec2(5.0, 12.0), t * 0.12) * 0.55
    );
    vec2 h3 = vec2(
      0.5 + warpedNoise(vec2(20.0, 15.0), t * 0.1) * 0.7,
      0.4 + warpedNoise(vec2(15.0, 22.0), t * 0.1) * 0.5
    );
    vec2 h4 = vec2(
      0.5 + warpedNoise(vec2(30.0, 25.0), t * 0.13) * 0.7,
      0.6 + warpedNoise(vec2(25.0, 32.0), t * 0.13) * 0.5
    );

    // Shape distortion — simple snoise (NOT warped, keeps blob shapes clean)
    float distort1 = snoise(uv * 2.5 + t * 0.5) * 0.15;
    float distort2 = snoise(uv * 3.0 - t * 0.4) * 0.12;
    float distort3 = snoise(uv * 2.8 + t * 0.45) * 0.14;
    float distort4 = snoise(uv * 2.2 - t * 0.55) * 0.13;

    vec2 d1 = uv - h1 + vec2(distort1, distort1 * 0.7);
    vec2 d2 = uv - h2 + vec2(distort2 * 0.8, distort2);
    vec2 d3 = uv - h3 + vec2(distort3, distort3 * 0.6);
    vec2 d4 = uv - h4 + vec2(distort4 * 0.9, distort4);

    // PULSES — layered fbm for richer timing, but slower
    float n1 = fbm(vec2(t * 0.08, 100.0));
    float n2 = fbm(vec2(t * 0.1, 200.0));
    float n3 = fbm(vec2(t * 0.07, 300.0));
    float n4 = fbm(vec2(t * 0.12, 400.0));

    float pulse1 = smoothstep(-0.3, 0.1, n1);
    float pulse2 = smoothstep(-0.2, 0.15, n2);
    float pulse3 = smoothstep(-0.35, 0.05, n3);
    float pulse4 = smoothstep(-0.25, 0.2, n4);
    // Guarantee minimum
    pulse1 = max(pulse1, 0.15);
    pulse3 = max(pulse3, 0.15);

    // Size breathing — blobs shrink and expand
    float size1 = 12.0 + snoise(vec2(t * 0.1, 50.0)) * 5.0;  // 7 to 17
    float size2 = 13.0 + snoise(vec2(t * 0.12, 55.0)) * 5.0;
    float size3 = 12.0 + snoise(vec2(t * 0.09, 60.0)) * 5.0;
    float size4 = 11.0 + snoise(vec2(t * 0.11, 65.0)) * 5.0;

    float r1 = exp(-size1 * length(d1)) * pulse1;
    float r2 = exp(-size2 * length(d2)) * pulse2;
    float r3 = exp(-size3 * length(d3)) * pulse3;
    float r4 = exp(-size4 * length(d4)) * pulse4;

    float reveal = min(r1 + r2 + r3 + r4, 1.0);

    // Grain — each blob independently ebbs between soft and crazy
    // Noise-driven grain intensity per blob — sometimes soft, sometimes wild
    // Color themes — teal, purple, blue (no orange)
    vec3 themeTeal = vec3(0.15, 0.6, 0.55);
    vec3 themePurple = vec3(0.45, 0.15, 0.6);
    vec3 themeBlue = vec3(0.1, 0.35, 0.65);

    // Slow noise picks which theme we're in
    float themeNoise = snoise(vec2(t * 0.1, 500.0)) * 0.5 + 0.5; // 0-1, faster cycling
    float satPulse = snoise(vec2(t * 0.3, 600.0)) * 0.3 + 0.7;

    // Smooth blend between 3 themes
    vec3 currentColor = themeTeal;
    float toPurple = smoothstep(0.25, 0.4, themeNoise);
    float toBlue = smoothstep(0.6, 0.75, themeNoise);
    float backTeal = 1.0 - smoothstep(0.85, 1.0, themeNoise);
    currentColor = mix(themeTeal, themePurple, toPurple);
    currentColor = mix(currentColor, themeBlue, toBlue);
    currentColor = mix(currentColor, themeTeal, 1.0 - backTeal);
    currentColor *= (0.7 + satPulse * 0.5);

    // Compose — blob color IS the bar color, not a tint on top
    vec3 dark = vec3(0.067, 0.063, 0.051);
    float barShape = (b0+b1+b2+b3+b4+b5+b6+b7+b8+b9+b10+b11);
    barShape = min(barShape, 1.0);

    // Each blob paints the bars in its own color directly
    vec3 coloredBars = vec3(0.0);
    coloredBars += r1 * currentColor * 1.8;
    coloredBars += r2 * currentColor * 2.0;
    coloredBars += r3 * currentColor * 1.8;
    coloredBars += r4 * currentColor * 2.0;

    // Grain — ONLY on bars, ebbs between soft and crazy per blob
    float maxGrain = 0.4;
    float gp1 = smoothstep(0.2, 0.7, snoise(vec2(t * 0.08, 700.0)));
    float gp2 = smoothstep(0.25, 0.75, snoise(vec2(t * 0.1, 800.0)));
    float gp3 = smoothstep(0.15, 0.65, snoise(vec2(t * 0.09, 900.0)));
    float gp4 = smoothstep(0.3, 0.8, snoise(vec2(t * 0.12, 1000.0)));
    float grain = 0.0;
    grain += snoise(gl_FragCoord.xy * 0.15) * r1 * barShape * mix(0.05, maxGrain, gp1);
    grain += snoise(gl_FragCoord.xy * 0.12 + vec2(50.0)) * r2 * barShape * mix(0.05, maxGrain, gp2);
    grain += snoise(gl_FragCoord.xy * 0.18 + vec2(100.0)) * r3 * barShape * mix(0.05, maxGrain, gp3);
    grain += snoise(gl_FragCoord.xy * 0.13 + vec2(150.0)) * r4 * barShape * mix(0.05, maxGrain, gp4);
    grain += snoise(gl_FragCoord.xy * 0.4 + vec2(t * 2.0)) * r1 * barShape * mix(0.02, 0.2, gp1);
    grain += snoise(gl_FragCoord.xy * 0.35 + vec2(t * 2.5) + vec2(50.0)) * r2 * barShape * mix(0.02, 0.22, gp2);
    grain += snoise(gl_FragCoord.xy * 0.45 + vec2(t * 1.8) + vec2(100.0)) * r3 * barShape * mix(0.02, 0.18, gp3);
    grain += snoise(gl_FragCoord.xy * 0.38 + vec2(t * 2.2) + vec2(150.0)) * r4 * barShape * mix(0.02, 0.2, gp4);

    vec3 color = dark + barShape * coloredBars + grain;

    // Glow halo
    color += r1 * currentColor * 0.08;
    color += r2 * currentColor * 0.10;
    color += r3 * currentColor * 0.06;
    color += r4 * currentColor * 0.10;

gl_FragColor = vec4(color, 1.0);
  }
`;

export function WebflowGradient({ children }: { children?: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef(Date.now());
  const rafRef = useRef<number>(0);
  const reduceMotionRef = useRef(false);
  const renderRef = useRef<(() => void) | null>(null);
  const { reduceMotion } = useMotionPreference();

  // Sync reduceMotion — restart render loop if preference turns off
  useEffect(() => {
    const wasReduced = reduceMotionRef.current;
    reduceMotionRef.current = reduceMotion;
    if (!reduceMotion && wasReduced && renderRef.current) {
      renderRef.current();
    }
  }, [reduceMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;
    glRef.current = gl;

    // Compile shaders with error checking
    const vs = gl.createShader(gl.VERTEX_SHADER);
    if (!vs) {
      console.error("Failed to create vertex shader");
      return;
    }
    gl.shaderSource(vs, VERTEX_SHADER);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error("Vertex shader error:", gl.getShaderInfoLog(vs));
      gl.deleteShader(vs);
      return;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fs) {
      console.error("Failed to create fragment shader");
      gl.deleteShader(vs);
      return;
    }
    gl.shaderSource(fs, FRAGMENT_SHADER);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("Fragment shader error:", gl.getShaderInfoLog(fs));
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      console.error("Failed to create program");
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }
    gl.useProgram(program);
    programRef.current = program;

    // Fullscreen quad
    const buf = gl.createBuffer();
    if (!buf) {
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    // Cache uniform locations
    const uTime = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = Math.max(1, canvas.clientWidth * dpr);
      const h = Math.max(1, canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uResolution, w, h);
    };

    resize();
    window.addEventListener("resize", resize);
    startTimeRef.current = Date.now();

    // Store render function in ref so reduceMotion effect can restart it
    const render = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      gl.uniform1f(uTime, elapsed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduceMotionRef.current) {
        rafRef.current = requestAnimationFrame(render);
      }
    };
    renderRef.current = render;

    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      renderRef.current = null;
    };
  }, []);

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
