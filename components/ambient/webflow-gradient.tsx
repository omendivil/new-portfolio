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
  uniform float u_isDark;
  // Canvas is now transparent — output premultiplied alpha

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
      fbm(p + vec2(0.0, 0.0) + vec2(t * 0.03)),
      fbm(p + vec2(5.2, 1.3) + vec2(t * 0.025))
    );
    return fbm(p + 1.5 * q);
  }

  // 3D bar — thick, compact. Light mode gets sharper edges + stronger shading
  float bar3d(float d, float pos, float width, float isDark) {
    float edgeSharp = isDark > 0.5 ? 0.05 : 0.02; // sharper edges in light mode
    float edge = smoothstep(pos, pos + width * edgeSharp, d) *
                 smoothstep(pos + width, pos + width - width * edgeSharp, d);
    float center = (d - pos) / width;
    float cx = abs(center * 2.0 - 1.0);
    // Light mode: steeper falloff for more pronounced 3D ridge
    float power = isDark > 0.5 ? 1.5 : 2.5;
    float shading = 1.0 - cx * pow(max(cx, 1e-4), power - 1.0);
    return edge * shading;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float t = u_time * 0.1;
    // Responsive layout — mobile vs desktop
    float aspect = u_resolution.x / u_resolution.y;
    float isMobile = 1.0 - smoothstep(0.8, 1.2, aspect);

    // Mobile: almost diagonal (~55deg), Desktop: standard diagonal (~49deg)
    float angle = mix(0.85, 1.0, isMobile);
    float diag = uv.x * cos(angle) + uv.y * sin(angle);

    // Palette — different for light vs dark mode
    float shift = sin(t * 0.4) * 0.5 + 0.5;
    vec3 colA, colB, bright;
    if (u_isDark > 0.5) {
      // Dark mode: teal bars on dark base (additive)
      vec3 teal1 = vec3(0.18, 0.60, 0.55);
      vec3 teal2 = vec3(0.12, 0.48, 0.44);
      bright = vec3(0.30, 0.75, 0.70);
      colA = mix(teal1, bright, shift);
      colB = mix(teal2, vec3(0.6, 0.3, 0.15), shift * 0.25);
    } else {
      // Light mode: blue/lavender watercolor stains (subtractive)
      vec3 blue1 = vec3(0.25, 0.40, 0.85);
      vec3 lavender = vec3(0.50, 0.35, 0.75);
      bright = vec3(0.30, 0.50, 0.90);
      colA = mix(blue1, bright, shift);
      colB = mix(lavender, vec3(0.40, 0.25, 0.65), shift * 0.3);
    }

    // Bar width — mobile: thick (0.22), desktop: standard (0.14)
    float bw = mix(0.14, 0.22, isMobile);
    // Bar gap — mobile: wider spacing, desktop: tight
    float bg = mix(0.15, 0.24, isMobile);

    // Desktop: 12 bars. Mobile: 7 fat bars (extras just go offscreen)
    float b0  = bar3d(diag, -0.10, bw, u_isDark);
    float b1  = bar3d(diag, -0.10 + bg, bw, u_isDark);
    float b2  = bar3d(diag, -0.10 + bg * 2.0, bw, u_isDark);
    float b3  = bar3d(diag, -0.10 + bg * 3.0, bw, u_isDark);
    float b4  = bar3d(diag, -0.10 + bg * 4.0, bw, u_isDark);
    float b5  = bar3d(diag, -0.10 + bg * 5.0, bw, u_isDark);
    float b6  = bar3d(diag, -0.10 + bg * 6.0, bw, u_isDark);
    float b7  = bar3d(diag, -0.10 + bg * 7.0, bw, u_isDark);
    float b8  = bar3d(diag, -0.10 + bg * 8.0, bw, u_isDark);
    float b9  = bar3d(diag, -0.10 + bg * 9.0, bw, u_isDark);
    float b10 = bar3d(diag, -0.10 + bg * 10.0, bw, u_isDark);
    float b11 = bar3d(diag, -0.10 + bg * 11.0, bw, u_isDark);

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

    // BLOB POSITIONS — each blob has its own shifting speed
    // Sometimes fast (catch up to others), sometimes slow (fall behind)
    float baseSpeed = u_isDark > 0.5 ? 1.5 : 1.0;
    float mSpeed1 = baseSpeed * (0.7 + snoise(vec2(t * 0.06, 800.0)) * 0.6); // 0.4x to 1.3x of base
    float mSpeed2 = baseSpeed * (0.7 + snoise(vec2(t * 0.08, 810.0)) * 0.6);
    float mSpeed3 = baseSpeed * (0.7 + snoise(vec2(t * 0.05, 820.0)) * 0.6);
    float mSpeed4 = baseSpeed * (0.7 + snoise(vec2(t * 0.07, 830.0)) * 0.6);
    vec2 h1 = vec2(
      0.3 + warpedNoise(vec2(0.0, 0.0), t * 0.15 * mSpeed1) * 0.5,
      0.5 + warpedNoise(vec2(3.0, 7.0), t * 0.15 * mSpeed1) * 0.5
    );
    vec2 h2 = vec2(
      0.7 + warpedNoise(vec2(10.0, 5.0), t * 0.12 * mSpeed2) * 0.5,
      0.5 + warpedNoise(vec2(5.0, 12.0), t * 0.12 * mSpeed2) * 0.55
    );
    vec2 h3 = vec2(
      0.5 + warpedNoise(vec2(20.0, 15.0), t * 0.1 * mSpeed3) * 0.7,
      0.4 + warpedNoise(vec2(15.0, 22.0), t * 0.1 * mSpeed3) * 0.5
    );
    vec2 h4 = vec2(
      0.5 + warpedNoise(vec2(30.0, 25.0), t * 0.13 * mSpeed4) * 0.7,
      0.6 + warpedNoise(vec2(25.0, 32.0), t * 0.13 * mSpeed4) * 0.5
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

    // First 35s excitement — declared early so pulses and sizes can use it
    float excitement = smoothstep(35.0, 8.0, u_time); // 1.0 at 8s, fades to 0 by 35s

    // PULSES — faster during first minute, dark mode faster overall
    float excitePulse = 1.0 + excitement * 0.8;
    float pSpeed = (u_isDark > 0.5 ? 1.6 : 1.0) * excitePulse;
    float n1 = fbm(vec2(t * 0.08 * pSpeed, 100.0));
    float n2 = fbm(vec2(t * 0.1 * pSpeed, 200.0));
    float n3 = fbm(vec2(t * 0.07 * pSpeed, 300.0));
    float n4 = fbm(vec2(t * 0.12 * pSpeed, 400.0));

    // Light mode: lower thresholds = blobs on more often, higher minimum
    float pMin = u_isDark > 0.5 ? 0.15 : 0.35;
    float pLow = u_isDark > 0.5 ? -0.3 : -0.5;
    float pulse1 = smoothstep(pLow, 0.1, n1);
    float pulse2 = smoothstep(pLow + 0.1, 0.15, n2);
    float pulse3 = smoothstep(pLow - 0.05, 0.05, n3);
    float pulse4 = smoothstep(pLow + 0.05, 0.2, n4);
    pulse1 = max(pulse1, pMin);
    pulse2 = max(pulse2, pMin);
    pulse3 = max(pulse3, pMin);
    pulse4 = max(pulse4, pMin);

    // Size breathing — intro surge then settle into small/medium ebb
    float sizeMin = u_isDark > 0.5 ? 12.0 : 5.0;
    float sizeMax = u_isDark > 0.5 ? 24.0 : 14.0;
    float sizeMedium = u_isDark > 0.5 ? 5.0 : 3.0; // "one corner" size — bigger reveal

    // Intro surge: big reveal in first 3 seconds
    float introSurge = smoothstep(4.0, 1.0, u_time);

    // Lower threshold = more frequent surges. 0.1 during excitement, 0.4 after settled
    float surgeThresh = mix(0.4, 0.1, excitement);

    float surge1 = smoothstep(surgeThresh, surgeThresh + 0.3, snoise(vec2(t * 0.08, 900.0)));
    float surge2 = smoothstep(surgeThresh + 0.05, surgeThresh + 0.35, snoise(vec2(t * 0.09, 910.0)));
    float surge3 = smoothstep(surgeThresh, surgeThresh + 0.3, snoise(vec2(t * 0.07, 920.0)));
    float surge4 = smoothstep(surgeThresh + 0.05, surgeThresh + 0.35, snoise(vec2(t * 0.085, 930.0)));

    float s1 = snoise(vec2(t * 0.07, 50.0)) * 0.5 + 0.5;
    float s2 = snoise(vec2(t * 0.09, 55.0)) * 0.5 + 0.5;
    float s3 = snoise(vec2(t * 0.06, 60.0)) * 0.5 + 0.5;
    float s4 = snoise(vec2(t * 0.08, 65.0)) * 0.5 + 0.5;

    // Intro: all blobs go big equally. After: individual surges to one corner
    float size1 = mix(mix(sizeMin, sizeMax, s1), sizeMedium, max(introSurge, surge1));
    float size2 = mix(mix(sizeMin, sizeMax, s2), sizeMedium + 1.0, max(introSurge, surge2));
    float size3 = mix(mix(sizeMin, sizeMax, s3), sizeMedium + 0.5, max(introSurge, surge3));
    float size4 = mix(mix(sizeMin, sizeMax, s4), sizeMedium + 1.5, max(introSurge, surge4));

    float r1 = exp(-size1 * length(d1)) * pulse1;
    float r2 = exp(-size2 * length(d2)) * pulse2;
    float r3 = exp(-size3 * length(d3)) * pulse3;
    float r4 = exp(-size4 * length(d4)) * pulse4;

    float reveal = min(r1 + r2 + r3 + r4, 1.0);

    // Color themes — different palettes for light/dark
    vec3 theme1, theme2, theme3;
    if (u_isDark > 0.5) {
      theme1 = vec3(0.15, 0.6, 0.55);   // teal
      theme2 = vec3(0.45, 0.15, 0.6);   // purple
      theme3 = vec3(0.1, 0.35, 0.65);   // blue
    } else {
      theme1 = vec3(0.30, 0.50, 0.90);  // bright blue
      theme2 = vec3(0.55, 0.35, 0.80);  // lavender
      theme3 = vec3(0.20, 0.55, 0.70);  // teal-blue
    }

    float themeNoise = snoise(vec2(t * 0.1, 500.0)) * 0.5 + 0.5;
    float satPulse = snoise(vec2(t * 0.3, 600.0)) * 0.3 + 0.7;

    vec3 currentColor = theme1;
    float toPurple = smoothstep(0.25, 0.4, themeNoise);
    float toBlue = smoothstep(0.6, 0.75, themeNoise);
    float backTeal = 1.0 - smoothstep(0.85, 1.0, themeNoise);
    currentColor = mix(theme1, theme2, toPurple);
    currentColor = mix(currentColor, theme3, toBlue);
    currentColor = mix(currentColor, theme1, 1.0 - backTeal);
    currentColor *= (0.7 + satPulse * 0.5);

    // Base colors
    vec3 dark = vec3(0.067, 0.063, 0.051);   // --background dark
    vec3 light = vec3(0.957, 0.945, 0.922);  // --background light (#f4f1eb)

    float barShape = (b0+b1+b2+b3+b4+b5+b6+b7+b8+b9+b10+b11);
    barShape = min(barShape, 1.0);

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

    // Transparent compositing — works on ANY background
    // The shader outputs colored bars with alpha, browser composites over HTML bg

    // Bar color + glow
    vec3 barColor = vec3(0.0);
    barColor += r1 * currentColor * 1.8;
    barColor += r2 * currentColor * 2.0;
    barColor += r3 * currentColor * 1.8;
    barColor += r4 * currentColor * 2.0;

    // Light mode: brighten the colors so they read as tints, not dark shadows
    if (u_isDark < 0.5) {
      barColor = currentColor * 0.8 + vec3(0.2);
    }

    // Alpha driven by bar shape * reveal — transparent where no bars
    float alpha = barShape * reveal;

    // Glow halo — ONLY on bars, not between them
    alpha += (r1 * 0.06 + r2 * 0.08 + r3 * 0.05 + r4 * 0.08) * barShape;
    alpha = min(alpha, 1.0);

    // Light mode needs stronger alpha to be visible against bright bg
    if (u_isDark < 0.5) {
      alpha *= 1.8;
      alpha = min(alpha, 0.85);
    }

    // Add grain into the color
    barColor += grain;

    // Kill faint ghost bars — if alpha is too low, snap to fully transparent
    // Prevents the burnt-in OLED look on dark backgrounds
    alpha = alpha > 0.06 ? alpha : 0.0;

    // Premultiplied alpha output
    gl_FragColor = vec4(barColor * alpha, alpha);
  }
`;

export function WebflowGradient({ children }: { children?: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
      cancelAnimationFrame(rafRef.current);
      renderRef.current();
    }
  }, [reduceMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return;

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

    // Enable blending for transparent compositing over HTML background
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // premultiplied alpha

    // Detach and free shaders after successful link — saves GPU memory
    gl.detachShader(program, vs);
    gl.detachShader(program, fs);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

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
    const uIsDark = gl.getUniformLocation(program, "u_isDark");

    // Set initial theme and observe changes
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      gl.uniform1f(uIsDark, isDark ? 1.0 : 0.0);
    };
    updateTheme();

    // Watch for theme toggle via MutationObserver on <html> class
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = Math.max(1, canvas.clientWidth * dpr);
      const h = Math.max(1, canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uResolution, w, h);
      }
    };

    // Set resolution unconditionally on first call
    resize();
    gl.uniform2f(uResolution, Math.max(1, canvas.width), Math.max(1, canvas.height));
    window.addEventListener("resize", resize);
    startTimeRef.current = Date.now();

    // Store render function in ref so reduceMotion effect can restart it
    const render = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      gl.uniform1f(uTime, elapsed);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
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
      observer.disconnect();
      gl.deleteProgram(program);
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
