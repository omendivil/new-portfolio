"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

// ── Constants ──
const ASCII =
  " .`'^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
const CELL_SIZE = 8;
const VIDEO_ZOOM = 1.6;
const VIDEO_SHIFT_Y = 0.06;
const FPS = 18;
const FRAME_MS = 1000 / FPS;

const VIDEO_SRC =
  "https://pub-d33280a8c527491aa0dc2ca665ee5f32.r2.dev/typing-person.mp4";
const FALLBACK_SRC =
  "https://pub-d33280a8c527491aa0dc2ca665ee5f32.r2.dev/omendivil_person_typing_on_a_keyboard_facing_the_camera_only__d900e9e5-54b4-48a5-860d-52c687f5174c_2.png";

const COLORS: number[][] = [
  [100, 200, 255], // cyan-blue
  [190, 195, 210], // colorless
  [168, 130, 255], // purple
  [195, 200, 215], // colorless
  [80, 220, 200], // teal
  [200, 205, 215], // colorless
  [230, 130, 180], // soft pink
  [190, 195, 210], // colorless
];

function lerpColor(a: number[], b: number[], t: number): number[] {
  return [
    (a[0] + (b[0] - a[0]) * t) | 0,
    (a[1] + (b[1] - a[1]) * t) | 0,
    (a[2] + (b[2] - a[2]) * t) | 0,
  ];
}

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  color: number[];
}

// ── Cover-fit with zoom + downward shift ──
function drawCover(
  source: HTMLVideoElement | HTMLImageElement,
  ctx: CanvasRenderingContext2D,
  tw: number,
  th: number,
) {
  const isVideo = source instanceof HTMLVideoElement;
  const sw0 = isVideo ? source.videoWidth : source.naturalWidth;
  const sh0 = isVideo ? source.videoHeight : source.naturalHeight;
  if (!sw0 || !sh0) return;

  const va = sw0 / sh0;
  const ta = tw / th;
  let sx: number, sy: number, sw: number, sh: number;
  if (va > ta) {
    sh = sh0;
    sw = sh0 * ta;
    sx = (sw0 - sw) / 2;
    sy = 0;
  } else {
    sw = sw0;
    sh = sw0 / ta;
    sx = 0;
    sy = (sh0 - sh) / 2;
  }
  const zx = (sw * (1 - 1 / VIDEO_ZOOM)) / 2;
  const zy = (sh * (1 - 1 / VIDEO_ZOOM)) / 2;
  sx += zx;
  sy += zy;
  sw /= VIDEO_ZOOM;
  sh /= VIDEO_ZOOM;
  sy += sh * VIDEO_SHIFT_Y;
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, tw, th);
}

export interface AsciiVideoBackgroundRef {
  triggerRipple: (e: React.MouseEvent) => void;
}

export const AsciiVideoBackground = forwardRef<AsciiVideoBackgroundRef, { active: boolean }>(function AsciiVideoBackground({ active }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({
    // Mutable render state — no React re-renders
    cols: 0,
    rows: 0,
    cellPx: 0,
    w: 0,
    h: 0,
    lastFrame: 0,
    frameCount: 0,
    charLen: ASCII.length,
    // Color
    globalColorIdx: 0,
    globalColor: COLORS[0],
    ripples: [] as Ripple[],
    // Per-cell state (allocated on resize)
    cellSettleTimers: null as Int8Array | null,
    cellCurrentChars: null as string[] | null,
    cellColors: null as number[][] | null,
    prevN: 0,
    // Fidelity
    fidelity: 0,
    // Video ready
    videoReady: false,
    videoFailed: false,
  });
  const sampleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fidelityRef = useRef<HTMLInputElement>(null);

  // ── Resize handler ──
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const videoCanvas = videoCanvasRef.current;
    if (!canvas || !videoCanvas) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const s = stateRef.current;
    s.w = canvas.width = window.innerWidth * dpr;
    s.h = canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    videoCanvas.width = s.w;
    videoCanvas.height = s.h;
    s.cellPx = CELL_SIZE * dpr;
    s.cols = Math.floor(s.w / s.cellPx);
    s.rows = Math.floor(s.h / s.cellPx);

    if (!sampleCanvasRef.current) {
      sampleCanvasRef.current = document.createElement("canvas");
    }
    sampleCanvasRef.current.width = s.cols;
    sampleCanvasRef.current.height = s.rows;
  }, []);

  useImperativeHandle(ref, () => ({
    triggerRipple: (e: React.MouseEvent) => handleClick(e),
  }));

  // ── Click → ripple ──
  const handleClick = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const s = stateRef.current;
    s.globalColorIdx = (s.globalColorIdx + 1) % COLORS.length;
    const newColor = COLORS[s.globalColorIdx];
    s.ripples.push({
      x,
      y,
      startTime: performance.now() / 1000,
      color: newColor,
    });
    if (s.ripples.length > 3) s.ripples.shift();
  }, []);

  // ── Init cells ──
  function initCells(s: (typeof stateRef)["current"], n: number) {
    s.cellSettleTimers = new Int8Array(n);
    s.cellCurrentChars = new Array(n).fill(" ");
    s.cellColors = new Array(n);
    for (let i = 0; i < n; i++) s.cellColors[i] = [...s.globalColor];
    s.prevN = n;
  }

  // ── Main draw loop ──
  useEffect(() => {
    if (!active) return;

    handleResize();
    window.addEventListener("resize", handleResize);

    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const videoCanvas = videoCanvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const videoCtx = videoCanvas.getContext("2d")!;
    const sampleCtx = sampleCanvasRef.current!.getContext("2d", {
      willReadFrequently: true,
    })!;

    function draw(now: number) {
      rafRef.current = requestAnimationFrame(draw);
      const s = stateRef.current;

      if (now - s.lastFrame < FRAME_MS) return;
      s.lastFrame = now;
      s.frameCount++;
      const timeSeconds = now / 1000;

      // Determine source: video or fallback image
      const source =
        s.videoReady && video.readyState >= 2 ? video : fallbackRef.current;
      if (!source) return;

      const n = s.cols * s.rows;
      if (s.prevN !== n) initCells(s, n);
      if (!s.cellSettleTimers || !s.cellCurrentChars || !s.cellColors) return;

      // Fidelity slider
      s.fidelity = fidelityRef.current
        ? Number(fidelityRef.current.value) / 100
        : 0;

      // Sample source with cover-fit
      drawCover(source, sampleCtx, s.cols, s.rows);

      // HD video layer
      if (s.fidelity > 0.01) {
        videoCanvas.style.opacity = String(s.fidelity);
        videoCtx.clearRect(0, 0, s.w, s.h);
        drawCover(source, videoCtx, s.w, s.h);
      } else {
        videoCanvas.style.opacity = "0";
      }

      canvas.style.opacity = String(1 - s.fidelity * 0.85);
      const imageData = sampleCtx.getImageData(0, 0, s.cols, s.rows).data;

      ctx.clearRect(0, 0, s.w, s.h);
      const dpr = Math.min(window.devicePixelRatio, 2);
      ctx.font = `bold ${s.cellPx * 0.88}px 'SF Mono','Fira Code','Courier New',monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Clean expired ripples
      for (let ri = s.ripples.length - 1; ri >= 0; ri--) {
        if (timeSeconds - s.ripples[ri].startTime > 10)
          s.ripples.splice(ri, 1);
      }

      const { cols, rows, cellPx, charLen } = s;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col;
          const i = idx * 4;
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];

          let brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          brightness = Math.pow(brightness, 0.55);
          if (brightness < 0.04) continue;

          const charIdx = Math.min(
            charLen - 1,
            Math.floor(brightness * (charLen - 1)),
          );
          const targetChar = ASCII[charIdx];
          if (targetChar === " ") continue;

          const cellNX = col / cols;
          const cellNY = row / rows;

          // Determine cell color from ripples
          let cellTargetColor = s.cellColors![idx] || s.globalColor;
          let onRippleFront = false;

          for (const rp of s.ripples) {
            const age = timeSeconds - rp.startTime;
            const radius = age * 0.18;
            const dx = cellNX - rp.x;
            const dy = cellNY - rp.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < radius) {
              cellTargetColor = rp.color;
            }
            if (Math.abs(dist - radius) < 0.03) {
              onRippleFront = true;
            }
          }

          const cc = s.cellColors![idx] || s.globalColor;
          s.cellColors![idx] = lerpColor(cc, cellTargetColor, 0.08);

          // Character settling
          if (s.cellCurrentChars![idx] === " " && targetChar !== " ") {
            s.cellSettleTimers![idx] = 3 + Math.floor(Math.random() * 6);
          }
          if (onRippleFront && s.cellSettleTimers![idx] <= 0) {
            s.cellSettleTimers![idx] = 2 + Math.floor(Math.random() * 5);
          } else if (
            s.cellSettleTimers![idx] <= 0 &&
            Math.random() < 0.003
          ) {
            s.cellSettleTimers![idx] = 2 + Math.floor(Math.random() * 4);
          }

          if (s.cellSettleTimers![idx] > 0) {
            s.cellSettleTimers![idx]--;
            s.cellCurrentChars![idx] =
              ASCII[Math.floor(Math.random() * charLen)];
          } else {
            s.cellCurrentChars![idx] = targetChar;
          }

          // Render
          const uc = s.cellColors![idx];
          const alpha = Math.min(1, brightness * 1.6 + 0.1);
          const fr = Math.min(255, (uc[0] * brightness * 1.8)) | 0;
          const fg = Math.min(255, (uc[1] * brightness * 1.8)) | 0;
          const fb = Math.min(255, (uc[2] * brightness * 1.8)) | 0;

          ctx.fillStyle = `rgba(${fr},${fg},${fb},${alpha})`;
          ctx.fillText(
            s.cellCurrentChars![idx],
            col * cellPx + cellPx / 2,
            row * cellPx + cellPx / 2,
          );
        }
      }
    }

    // Start video
    try {
      video.play().catch(() => {
        stateRef.current.videoFailed = true;
      });
    } catch {
      stateRef.current.videoFailed = true;
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [active, handleResize]);

  // Load fallback image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = FALLBACK_SRC;
    img.onload = () => {
      fallbackRef.current = img;
    };
  }, []);

  return (
    <>
      {/* Hidden video source */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        crossOrigin="anonymous"
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => {
          stateRef.current.videoReady = true;
        }}
        onError={() => {
          stateRef.current.videoFailed = true;
        }}
        className="fixed left-0 top-0 h-px w-px opacity-0 pointer-events-none"
      />

      {/* ASCII canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="absolute inset-0 w-full h-full cursor-pointer"
      />

      {/* HD video overlay canvas */}
      <canvas
        ref={videoCanvasRef}
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
      />

      {/* Fidelity slider */}
      <div data-no-ripple className="absolute bottom-4 right-4 z-20 flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-[rgba(8,8,14,0.6)] px-3.5 py-2 font-mono text-[10px] text-white/30 backdrop-blur-md">
        <span className="uppercase tracking-widest">ASCII</span>
        <input
          ref={fidelityRef}
          type="range"
          min="0"
          max="100"
          defaultValue="0"
          className="h-[3px] w-[100px] cursor-pointer appearance-none rounded-sm bg-white/10 outline-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/15 [&::-webkit-slider-thumb]:bg-white/70"
        />
        <span className="uppercase tracking-widest">HD</span>
      </div>
    </>
  );
});
