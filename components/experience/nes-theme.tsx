"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Experience } from "@/data/types";

type NESThemeProps = {
  experiences: Experience[];
};

/* ═══════════════════════════════════════════════
   2D CONTROLLER — visual D-pad + A/B buttons
   ═══════════════════════════════════════════════ */

function NESController({
  onLeft,
  onRight,
  onEasterEgg,
}: {
  onLeft: () => void;
  onRight: () => void;
  onEasterEgg: () => void;
}) {
  const [showEggHint, setShowEggHint] = useState(false);

  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8"
      style={{
        background: "linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)",
        borderRadius: "0 0 24px 24px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      {/* D-pad — only left/right navigate */}
      <div className="relative h-[72px] w-[72px] flex-shrink-0">
        {/* Horizontal bar */}
        <div
          className="absolute left-0 top-1/2 flex h-6 w-full -translate-y-1/2 items-stretch"
          style={{
            background: "#1a1a1a",
            borderRadius: 3,
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <button
            type="button"
            onClick={onLeft}
            className="flex flex-1 items-center justify-center text-[10px] text-[#888] active:bg-[#333] active:text-white"
            style={{ borderRadius: "3px 0 0 3px" }}
            aria-label="Previous quest"
          >
            ◄
          </button>
          <div className="w-6" />
          <button
            type="button"
            onClick={onRight}
            className="flex flex-1 items-center justify-center text-[10px] text-[#888] active:bg-[#333] active:text-white"
            style={{ borderRadius: "0 3px 3px 0" }}
            aria-label="Next quest"
          >
            ►
          </button>
        </div>
        {/* Vertical bar (decorative) */}
        <div
          className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2"
          style={{
            background: "#1a1a1a",
            borderRadius: 3,
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05)",
          }}
        />
        {/* Center nub */}
        <div
          className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "#222", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)" }}
        />
      </div>

      {/* Center — brand label */}
      <div className="flex flex-col items-center gap-1.5">
        <div
          className="text-[6px] uppercase tracking-[0.25em]"
          style={{ fontFamily: "'Press Start 2P', monospace", color: "#444" }}
        >
          MENDIVIL
        </div>
        <div
          className="text-[5px] uppercase tracking-[0.1em]"
          style={{ fontFamily: "'Press Start 2P', monospace", color: "#333" }}
        >
          ◄ ► browse quests
        </div>
      </div>

      {/* A/B buttons — A triggers easter egg with warning */}
      <div className="relative flex flex-shrink-0 items-center gap-3" style={{ transform: "rotate(-15deg)" }}>
        {/* B button — decorative only */}
        <div className="flex flex-col items-center gap-0.5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-[9px] font-bold text-[#1a1a1a]"
            style={{
              background: "radial-gradient(circle at 35% 35%, #666, #444)",
              boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3), 0 0 0 2px #222",
              fontFamily: "'Press Start 2P', monospace",
              opacity: 0.5,
            }}
          >
            B
          </div>
        </div>

        {/* A button — easter egg entry */}
        <div className="flex flex-col items-center gap-0.5" style={{ marginTop: -12 }}>
          <button
            type="button"
            onClick={() => {
              if (showEggHint) {
                onEasterEgg();
                setShowEggHint(false);
              } else {
                setShowEggHint(true);
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[9px] font-bold text-[#1a1a1a] active:brightness-90"
            style={{
              background: "radial-gradient(circle at 35% 35%, #cc3333, #990000)",
              boxShadow: showEggHint
                ? "inset 0 -2px 4px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3), 0 0 0 2px #222, 0 0 12px rgba(204,51,51,0.4)"
                : "inset 0 -2px 4px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3), 0 0 0 2px #222",
              fontFamily: "'Press Start 2P', monospace",
              transition: "box-shadow 0.2s",
            }}
            aria-label="Easter egg mini-game"
          >
            A
          </button>
        </div>

        {/* Easter egg hint tooltip */}
        {showEggHint && (
          <div
            className="absolute -top-10 right-0 z-30 whitespace-nowrap rounded px-2 py-1"
            style={{
              background: "rgba(0,0,0,0.9)",
              border: "1px solid #48c848",
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 6,
              color: "#48c848",
              boxShadow: "0 0 8px rgba(72,200,72,0.2)",
              transform: "rotate(15deg)",
            }}
          >
            🎮 mini-game! press A again
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SIDE-SCROLLER MINI-GAME (easter egg)
   ═══════════════════════════════════════════════ */

type GameState = "idle" | "running" | "jumping" | "dead" | "won";
type Obstacle = { x: number; width: number; height: number; passed: boolean };

const GAME_W = 256;
const GAME_H = 140;
const GROUND_Y = 115;
const PLAYER_H = 16;
const PLAYER_X = 40;
const GRAVITY = 0.6;
const JUMP_FORCE = -9;
const GAME_SPEED = 2.5;
const OBSTACLE_GAP = 120;
const OBSTACLES_PER_LEVEL = 3;

function SideScrollerGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameState = useRef<GameState>("idle");
  const playerY = useRef(GROUND_Y - PLAYER_H);
  const velocityY = useRef(0);
  const obstacles = useRef<Obstacle[]>([]);
  const score = useRef(0);
  const frameId = useRef(0);

  const initObstacles = useCallback(() => {
    obstacles.current = [];
    for (let i = 0; i < OBSTACLES_PER_LEVEL; i++) {
      obstacles.current.push({
        x: GAME_W + i * OBSTACLE_GAP + 60,
        width: 10 + Math.floor(Math.random() * 8),
        height: 12 + Math.floor(Math.random() * 16),
        passed: false,
      });
    }
  }, []);

  const jump = useCallback(() => {
    if (gameState.current === "idle" || gameState.current === "dead" || gameState.current === "won") {
      gameState.current = "running";
      playerY.current = GROUND_Y - PLAYER_H;
      velocityY.current = 0;
      score.current = 0;
      initObstacles();
    } else if (playerY.current >= GROUND_Y - PLAYER_H - 1) {
      velocityY.current = JUMP_FORCE;
      gameState.current = "jumping";
    }
  }, [initObstacles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump(); }
      if (e.code === "Escape") onClose();
    };
    canvas.addEventListener("keydown", handleKey);

    const loop = () => {
      frameId.current = requestAnimationFrame(loop);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, GAME_W, GAME_H);

      // Ground
      ctx.fillStyle = "#1a3a1a";
      ctx.fillRect(0, GROUND_Y, GAME_W, GAME_H - GROUND_Y);
      ctx.strokeStyle = "#48c848";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(GAME_W, GROUND_Y);
      ctx.stroke();

      // Stars + moon
      ctx.fillStyle = "#f8d848";
      for (let i = 0; i < 15; i++) {
        ctx.fillRect((i * 37 + 13) % GAME_W, ((i * 23 + 7) % (GROUND_Y - 20)) + 5, 1, 1);
      }
      ctx.fillStyle = "#e8e8d8";
      ctx.beginPath();
      ctx.arc(GAME_W - 30, 20, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(GAME_W - 27, 18, 6, 0, Math.PI * 2);
      ctx.fill();

      if (gameState.current === "running" || gameState.current === "jumping") {
        velocityY.current += GRAVITY;
        playerY.current += velocityY.current;
        if (playerY.current >= GROUND_Y - PLAYER_H) {
          playerY.current = GROUND_Y - PLAYER_H;
          velocityY.current = 0;
          if (gameState.current === "jumping") gameState.current = "running";
        }

        let allPassed = true;
        for (const obs of obstacles.current) {
          obs.x -= GAME_SPEED;
          if (PLAYER_X + 10 > obs.x && PLAYER_X + 2 < obs.x + obs.width && playerY.current + PLAYER_H > GROUND_Y - obs.height) {
            gameState.current = "dead";
          }
          if (!obs.passed && obs.x + obs.width < PLAYER_X) { obs.passed = true; score.current++; }
          if (!obs.passed) allPassed = false;
        }
        if (allPassed && obstacles.current.length > 0) gameState.current = "won";
      }

      // Obstacles
      ctx.fillStyle = "#f8f8f8";
      for (const obs of obstacles.current) ctx.fillRect(obs.x, GROUND_Y - obs.height, obs.width, obs.height);

      // Player
      const py = Math.round(playerY.current);
      ctx.fillStyle = "#48c848";
      ctx.fillRect(PLAYER_X + 2, py - 5, 8, 6);
      ctx.fillRect(PLAYER_X + 3, py, 6, 10);
      ctx.fillStyle = "#f8f8f8";
      ctx.fillRect(PLAYER_X + 4, py - 4, 2, 2);
      ctx.fillRect(PLAYER_X + 7, py - 4, 2, 2);
      ctx.fillStyle = "#48c848";
      const legFrame = Math.floor(Date.now() / 100) % 2;
      ctx.fillRect(PLAYER_X + 3 + (gameState.current === "running" ? legFrame : 0), py + 10, 3, 5);
      ctx.fillRect(PLAYER_X + 6 + (gameState.current === "running" ? -legFrame : 0), py + 10, 3, 5);

      // HUD
      ctx.fillStyle = "#f8d848";
      ctx.font = "8px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`SCORE: ${score.current}`, 4, 12);
      ctx.textAlign = "right";
      ctx.fillText("ESC: EXIT", GAME_W - 4, 12);
      ctx.textAlign = "left";

      // Overlays
      if (gameState.current === "idle") {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, GAME_W, GAME_H);
        ctx.fillStyle = "#f8f8f8";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("PRESS SPACE / TAP", GAME_W / 2, GAME_H / 2 - 4);
        ctx.textAlign = "left";
      }
      if (gameState.current === "dead") {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, GAME_W, GAME_H);
        ctx.fillStyle = "#f84848";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", GAME_W / 2, GAME_H / 2 - 6);
        ctx.fillStyle = "#a8a8a8";
        ctx.font = "8px monospace";
        ctx.fillText("tap to retry", GAME_W / 2, GAME_H / 2 + 8);
        ctx.textAlign = "left";
      }
      if (gameState.current === "won") {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, GAME_W, GAME_H);
        ctx.fillStyle = "#48c848";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("YOU WIN! TAP TO PLAY AGAIN", GAME_W / 2, GAME_H / 2 - 4);
        ctx.textAlign = "left";
      }

      // Scanlines
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      for (let y = 0; y < GAME_H; y += 3) ctx.fillRect(0, y, GAME_W, 1);
    };

    frameId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId.current);
  }, [jump, onClose]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={GAME_W}
        height={GAME_H}
        tabIndex={0}
        className="w-full cursor-pointer outline-none"
        style={{ imageRendering: "pixelated" }}
        onClick={jump}
        onTouchStart={(e) => { e.preventDefault(); jump(); }}
        autoFocus
      />
      <button
        type="button"
        onClick={onClose}
        className="absolute right-2 top-2 z-10 text-[8px] text-[#888] hover:text-[#f8f8f8]"
        style={{ fontFamily: "'Press Start 2P', monospace", background: "none", border: "none", cursor: "pointer" }}
      >
        ✕ EXIT
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NES TEXT BOX — shows experience data
   ═══════════════════════════════════════════════ */

function NESRecord({ experience }: { experience: Experience }) {
  return (
    <div
      className="space-y-3"
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 11,
        lineHeight: 2.2,
        color: "#e8e8e8",
      }}
    >
      {/* Role — large, bright gold */}
      <div style={{ color: "#f8d848", fontSize: 13, textShadow: "0 0 8px rgba(248,216,72,0.3)" }}>
        {experience.role.toUpperCase()}
      </div>

      {/* Metadata — brighter gray for readability */}
      <div
        className="rounded px-3 py-2"
        style={{
          color: "#c8c8c8",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          fontSize: 10,
        }}
      >
        <div>⚔ {experience.organization} · {experience.location}</div>
        <div>⏱ {experience.period}</div>
      </div>

      {/* Summary — slightly larger, warm white */}
      <div style={{ color: "#d8d8d0", lineHeight: 2.4 }}>{experience.summary}</div>

      {/* Bullets — each in its own row with better spacing */}
      <div className="space-y-2">
        {experience.bullets.map((bullet) => (
          <div
            key={bullet}
            className="relative rounded pl-6 pr-2 py-1.5"
            style={{
              background: "rgba(72,200,72,0.04)",
              border: "1px solid rgba(72,200,72,0.08)",
              color: "#d0d8d0",
              fontSize: 10,
              lineHeight: 2,
            }}
          >
            <span className="absolute left-2 top-1.5" style={{ color: "#48c848" }}>▸</span>
            {bullet}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN NES THEME
   ═══════════════════════════════════════════════ */

export function NESTheme({ experiences }: NESThemeProps) {
  const [currentRecord, setCurrentRecord] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [booted, setBooted] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());
  const total = experiences.length;

  // Boot sequence
  useEffect(() => {
    if (reduceMotion) { setBooted(true); return; }
    const t = setTimeout(() => setBooted(true), 800);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  const prev = useCallback(() => setCurrentRecord((i) => Math.max(i - 1, 0)), []);
  const next = useCallback(() => setCurrentRecord((i) => Math.min(i + 1, total - 1)), [total]);

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showGame) return;
      if (e.code === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.code === "ArrowRight") { e.preventDefault(); next(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showGame, prev, next]);

  return (
    <div className="mx-auto w-full max-w-3xl lg:max-w-4xl">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />

      {/* NES Console Frame */}
      <div className="overflow-hidden rounded-lg" style={{ background: "#111" }}>
        {/* Screen area */}
        <div
          className="relative overflow-hidden"
          style={{ background: "#000" }}
        >
          {/* Scanlines overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-50"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
            }}
          />

          {/* Boot screen */}
          <AnimatePresence>
            {!booted && !reduceMotion && (
              <motion.div
                className="absolute inset-0 z-40 flex flex-col items-center justify-center"
                style={{ background: "#000", fontFamily: "'Press Start 2P', monospace" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0.5, 1] }}
                  transition={{ duration: 0.6, times: [0, 0.2, 0.4, 0.6, 1] }}
                  className="text-center"
                >
                  <div style={{ fontSize: 12, color: "#f8f8f8" }}>MENDIVIL</div>
                  <div style={{ fontSize: 7, color: "#a8a8a8", marginTop: 8 }}>Entertainment System</div>
                  <motion.div
                    className="mx-auto mt-4 h-0.5 bg-[#f8d848]"
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content */}
          <div className="p-4 sm:p-6">
            {/* Header bar */}
            <div
              className="mb-3 flex items-center justify-between"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                color: "#f8f8f8",
                border: "3px solid #f8f8f8",
                boxShadow: "inset 0 0 0 3px #000, inset 0 0 0 6px #f8f8f8",
                padding: "8px 12px",
              }}
            >
              <span>★ QUEST LOG ★</span>
              <button
                type="button"
                onClick={() => setShowGame(true)}
                style={{
                  fontFamily: "inherit",
                  fontSize: 7,
                  color: "#48c848",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ▶ PLAY GAME
              </button>
            </div>

            <AnimatePresence mode="wait">
              {showGame ? (
                <motion.div
                  key="game"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SideScrollerGame onClose={() => setShowGame(false)} />
                </motion.div>
              ) : (
                <motion.div
                  key="quest-log"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: booted ? 1 : 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Quest content — slightly lifted background for readability */}
                  <div
                    style={{
                      border: "3px solid #f8f8f8",
                      boxShadow: "inset 0 0 0 3px #0a0a0a, inset 0 0 0 6px #f8f8f8",
                      padding: "20px 18px",
                      minHeight: 200,
                      background: "#0a0a12",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentRecord}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <NESRecord experience={experiences[currentRecord]} />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Quest selector dots */}
                  <div className="mt-3 flex items-center justify-center gap-3">
                    {experiences.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentRecord(i)}
                        className="transition-all duration-150"
                        style={{
                          width: i === currentRecord ? 20 : 8,
                          height: 8,
                          background: i === currentRecord ? "#f8d848" : "#333",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: 2,
                          boxShadow: i === currentRecord ? "0 0 6px rgba(248,216,72,0.4)" : "none",
                        }}
                        aria-label={`Quest ${i + 1}`}
                      />
                    ))}
                  </div>

                  {/* Record counter */}
                  <div
                    className="mt-2 text-center"
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 8,
                      color: "#666",
                    }}
                  >
                    ◄ {currentRecord + 1}/{total} ►
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Controller — always visible below the screen */}
        {!showGame && (
          <NESController
            onLeft={prev}
            onRight={next}
            onEasterEgg={() => setShowGame(true)}
          />
        )}
      </div>
    </div>
  );
}
