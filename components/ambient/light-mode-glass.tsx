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

// Pass 2: Glass refraction shader — samples the bar texture with distorted UVs
const REFRACTION_SHADER = `
  precision mediump float;
  uniform sampler2D u_barTexture;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_isDark;

  // Simplex noise (same as main shader)
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

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float t = u_time * 0.1;

    // REFRACTION: distort UV to bend the bar texture like looking through glass
    float refractionStrength = u_isDark > 0.5 ? 0.012 : 0.018;
    vec2 distortion = vec2(
      snoise(uv * 4.0 + vec2(t * 0.4, 0.0)) * refractionStrength,
      snoise(uv * 4.0 + vec2(0.0, t * 0.35)) * refractionStrength
    );

    // BEVEL: stronger distortion at edges of visible bars (like thick glass rim)
    vec4 centerSample = texture2D(u_barTexture, uv);
    float barPresence = centerSample.a;
    float bevel = barPresence * 0.008;
    distortion += vec2(
      snoise(uv * 8.0 + vec2(t * 0.2)) * bevel,
      snoise(uv * 8.0 + vec2(0.0, t * 0.25)) * bevel
    );

    // Sample the bar texture with refracted UVs
    vec4 refracted = texture2D(u_barTexture, uv + distortion);

    // SPECULAR HIGHLIGHT: bright streak that sits ON the glass surface
    float spec = snoise(uv * 6.0 + vec2(t * 0.5, t * 0.3));
    float specHighlight = pow(max(spec, 0.0), 4.0) * barPresence * 0.15;

    // FROST: subtle blur by averaging nearby samples
    vec2 px = vec2(1.0) / u_resolution;
    vec4 frost = refracted * 0.4;
    frost += texture2D(u_barTexture, uv + distortion + px * vec2(1.5, 0.0)) * 0.15;
    frost += texture2D(u_barTexture, uv + distortion - px * vec2(1.5, 0.0)) * 0.15;
    frost += texture2D(u_barTexture, uv + distortion + px * vec2(0.0, 1.5)) * 0.15;
    frost += texture2D(u_barTexture, uv + distortion - px * vec2(0.0, 1.5)) * 0.15;

    vec4 color = frost;

    // Add specular as white on top
    color.rgb += vec3(specHighlight);
    color.a += specHighlight * 0.5;
    color.a = min(color.a, 1.0);

    gl_FragColor = color;
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

  // 3D bar with Phong-style lighting on light mode
  float bar3d(float d, float pos, float width, float isDark) {
    float edgeSharp = isDark > 0.5 ? 0.05 : 0.02;
    float edge = smoothstep(pos, pos + width * edgeSharp, d) *
                 smoothstep(pos + width, pos + width - width * edgeSharp, d);
    float center = (d - pos) / width; // 0 at left edge, 1 at right edge
    float cx = abs(center * 2.0 - 1.0); // 0 at center, 1 at edges

    if (isDark > 0.5) {
      // Dark mode: simple bright ridge
      float shading = 1.0 - cx * sqrt(max(cx, 1e-4));
      return edge * shading;
    } else {
      // Light mode: frosted glass bar with Fresnel + caustic + 5-zone shading
      float lit = 1.0 - center;

      // === 5-ZONE CYLINDER BASE ===
      float highlight = pow(max(1.0 - abs(center - 0.35) * 3.0, 0.0), 4.0) * 0.7;
      float fullLight = smoothstep(0.3, 0.7, lit) * 0.5;
      float halfTone = smoothstep(0.2, 0.4, lit) * 0.25;
      float coreShadow = smoothstep(0.6, 0.85, center) * smoothstep(1.0, 0.85, center) * 1.4;
      float reflected = smoothstep(0.88, 1.0, center) * 0.4;

      // === FRESNEL REFLECTION — edges reflect more (glass property) ===
      // Both edges glow bright like light catching glass rim
      float fresnel = pow(cx, 3.0) * 0.9;

      // === SHARP CAUSTIC — concentrated light refraction, almost white ===
      // Sharper and brighter than the diffuse highlight
      float caustic = pow(max(1.0 - abs(center - 0.3) * 4.0, 0.0), 8.0) * 1.0;

      // === COLOR SHINE — light refracting THROUGH the glass tints the highlight ===
      // This makes the shine feel like it's coming from the colored glass itself
      // (Applied in the compositing section via a separate return channel)
      float shineZone = pow(max(1.0 - abs(center - 0.3) * 3.5, 0.0), 6.0);

      // === FROSTED TEXTURE — subtle noise variation for frosted glass feel ===
      // Reduces in the caustic/Fresnel zones (glass is smoother where polished)
      float frostMask = 1.0 - max(caustic, fresnel * 0.5);

      // Combine all zones
      float shading = fullLight + highlight + halfTone + reflected;
      shading += coreShadow * 0.5;
      shading += fresnel;        // bright glass edges
      shading += caustic;        // sharp white refraction
      shading += shineZone * 0.3; // colored shine contribution

      // Pack frost mask into the return — we'll use it to reduce grain
      // Multiply by (1 + frostMask * 0.2) so compositing can extract it
      return edge * max(shading, 0.05) * (0.8 + frostMask * 0.2);
    }
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
      // Light mode: pastel watercolor — softer, more muted than dark mode
      vec3 blue1 = vec3(0.55, 0.65, 0.90);
      vec3 lavender = vec3(0.70, 0.60, 0.85);
      bright = vec3(0.60, 0.70, 0.92);
      colA = mix(blue1, bright, shift);
      colB = mix(lavender, vec3(0.65, 0.55, 0.80), shift * 0.3);
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
      theme1 = vec3(0.60, 0.70, 0.92);  // pastel blue
      theme2 = vec3(0.72, 0.60, 0.85);  // soft lavender
      theme3 = vec3(0.55, 0.72, 0.78);  // soft teal
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

    // Grain — ONLY on bars. Light mode: reduced in glass shine zones
    float maxGrain = u_isDark > 0.5 ? 0.4 : 0.25; // less grain on light mode glass
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

    // Light mode: frosted glass with lensing, bloom, and bevel
    float glassBloom = 0.0;
    if (u_isDark < 0.5) {
      barColor = currentColor * 0.8 + vec3(0.2);

      // FAKE LENSING — shift the bar pattern slightly based on position
      // Creates a subtle wobble as if seen through curved glass
      float lensShift = snoise(uv * 8.0 + vec2(t * 0.3)) * 0.008;
      barColor *= 1.0 + lensShift * 3.0; // subtle color distortion

      // SPECULAR BLOOM — white highlight that boosts ALPHA (not just color)
      // This is the key: more opaque = visually brighter against light bg
      float diag2 = uv.x * cos(angle) + uv.y * sin(angle);
      float barPos = fract(diag2 / bg);
      float specStreak = pow(max(1.0 - abs(barPos * 2.0 - 0.6) * 3.0, 0.0), 5.0);
      glassBloom = specStreak * reveal * barShape * 0.4;

      // Mix toward white in the bloom zone
      barColor = mix(barColor, vec3(1.0), glassBloom * 0.7);

      // EDGE BEVEL — darken at bar edges (thicker glass bends more light)
      float bevelDark = pow(max(fract(diag2 / bg) * 2.0 - 1.0, 0.0), 2.0) * 0.15;
      float bevelDark2 = pow(max(1.0 - fract(diag2 / bg) * 2.0, 0.0), 2.0) * 0.15;
      barColor *= 1.0 - (bevelDark + bevelDark2) * reveal;
    }

    // Alpha driven by bar shape * reveal — transparent where no bars
    float alpha = barShape * reveal;

    // Glow halo — ONLY on bars, not between them
    alpha += (r1 * 0.06 + r2 * 0.08 + r3 * 0.05 + r4 * 0.08) * barShape;
    alpha = min(alpha, 1.0);

    // Light mode: alpha + bloom boost in specular zones
    if (u_isDark < 0.5) {
      alpha *= 1.4;
      alpha += glassBloom; // specular bloom pushes alpha higher = visually brighter
      alpha = min(alpha, 0.75);
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

export function LightModeGlass({ children }: { children?: React.ReactNode }) {
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

    // === COMPILE REFRACTION SHADER (Pass 2) ===
    const vs2 = gl.createShader(gl.VERTEX_SHADER);
    if (!vs2) return;
    gl.shaderSource(vs2, VERTEX_SHADER);
    gl.compileShader(vs2);
    if (!gl.getShaderParameter(vs2, gl.COMPILE_STATUS)) {
      console.error("Refraction vertex error:", gl.getShaderInfoLog(vs2));
      return;
    }
    const fs2 = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fs2) { gl.deleteShader(vs2); return; }
    gl.shaderSource(fs2, REFRACTION_SHADER);
    gl.compileShader(fs2);
    if (!gl.getShaderParameter(fs2, gl.COMPILE_STATUS)) {
      console.error("Refraction fragment error:", gl.getShaderInfoLog(fs2));
      gl.deleteShader(vs2); gl.deleteShader(fs2); return;
    }
    const refractionProgram = gl.createProgram();
    if (!refractionProgram) { gl.deleteShader(vs2); gl.deleteShader(fs2); return; }
    gl.attachShader(refractionProgram, vs2);
    gl.attachShader(refractionProgram, fs2);
    gl.linkProgram(refractionProgram);
    if (!gl.getProgramParameter(refractionProgram, gl.LINK_STATUS)) {
      console.error("Refraction link error:", gl.getProgramInfoLog(refractionProgram));
      gl.deleteProgram(refractionProgram); gl.deleteShader(vs2); gl.deleteShader(fs2); return;
    }
    gl.detachShader(refractionProgram, vs2);
    gl.detachShader(refractionProgram, fs2);
    gl.deleteShader(vs2);
    gl.deleteShader(fs2);

    // Cache refraction uniforms
    const r_uTime = gl.getUniformLocation(refractionProgram, "u_time");
    const r_uResolution = gl.getUniformLocation(refractionProgram, "u_resolution");
    const r_uIsDark = gl.getUniformLocation(refractionProgram, "u_isDark");
    const r_uBarTexture = gl.getUniformLocation(refractionProgram, "u_barTexture");

    // === FULLSCREEN QUAD (shared by both programs) ===
    const buf = gl.createBuffer();
    if (!buf) { gl.deleteProgram(program); gl.deleteProgram(refractionProgram); return; }
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    // === FRAMEBUFFER — bars render here first, then refraction reads it ===
    const fbTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, fbTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbTexture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    // Cache pass 1 uniform locations
    const uTime = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uIsDark = gl.getUniformLocation(program, "u_isDark");

    // Theme observer
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      gl.useProgram(program);
      gl.uniform1f(uIsDark, isDark ? 1.0 : 0.0);
      gl.useProgram(refractionProgram);
      gl.uniform1f(r_uIsDark, isDark ? 1.0 : 0.0);
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    let fbWidth = 0, fbHeight = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = Math.max(1, canvas.clientWidth * dpr);
      const h = Math.max(1, canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        // Resize framebuffer texture
        gl.bindTexture(gl.TEXTURE_2D, fbTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        fbWidth = w;
        fbHeight = h;
        // Update resolution on both programs
        gl.useProgram(program);
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uResolution, w, h);
        gl.useProgram(refractionProgram);
        gl.uniform2f(r_uResolution, w, h);
      }
    };

    resize();
    // Force initial framebuffer texture allocation
    gl.bindTexture(gl.TEXTURE_2D, fbTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    fbWidth = canvas.width;
    fbHeight = canvas.height;

    window.addEventListener("resize", resize);
    startTimeRef.current = Date.now();

    const render = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const isDark = document.documentElement.classList.contains("dark");

      if (isDark) {
        // === DARK MODE: Single pass, straight to screen (unchanged from before) ===
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);
        const pos1 = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(pos1);
        gl.vertexAttribPointer(pos1, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1f(uTime, elapsed);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      } else {
        // === LIGHT MODE: Two-pass with glass refraction ===
        // Pass 1: Render bars to framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.viewport(0, 0, fbWidth, fbHeight);
        gl.useProgram(program);
        const pos1 = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(pos1);
        gl.vertexAttribPointer(pos1, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1f(uTime, elapsed);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // Pass 2: Refract onto screen
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(refractionProgram);
        const pos2 = gl.getAttribLocation(refractionProgram, "position");
        gl.enableVertexAttribArray(pos2);
        gl.vertexAttribPointer(pos2, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1f(r_uTime, elapsed);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, fbTexture);
        gl.uniform1i(r_uBarTexture, 0);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

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
      gl.deleteProgram(refractionProgram);
      gl.deleteBuffer(buf);
      gl.deleteTexture(fbTexture);
      gl.deleteFramebuffer(framebuffer);
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
