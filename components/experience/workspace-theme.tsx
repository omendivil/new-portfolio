"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Sparkles } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

import type { Experience } from "@/data/types";

type WorkspaceThemeProps = {
  experiences: Experience[];
};

/* ═══════════════════════════════════════════════
   DYNAMIC CHUNK GROUND — generates tiles around camera
   Tiles pop in as you move, disappear when far away
   ═══════════════════════════════════════════════ */

const TILE_SIZE = 0.45;
const VIEW_RADIUS = 4;
const FADE_RADIUS = 5;

function DynamicGround({ isDark = true }: { isDark?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const tilesRef = useRef<Map<string, { mesh: THREE.Mesh; born: number }>>(new Map());
  const { camera } = useThree();
  const geoRef = useRef<THREE.BoxGeometry | null>(null);
  const matCache = useRef<Map<string, THREE.MeshStandardMaterial>>(new Map());

  useEffect(() => {
    geoRef.current = new THREE.BoxGeometry(TILE_SIZE - 0.02, 0.08, TILE_SIZE - 0.02);
    return () => {
      geoRef.current?.dispose();
      matCache.current.forEach((m) => m.dispose());
      matCache.current.clear();
    };
  }, []);

  // Reusable vector — avoid per-frame allocation
  const _tempVec = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!groupRef.current || !geoRef.current) return;
    camera.getWorldDirection(_tempVec.current);

    // Use orbit target as center (approximate from camera)
    const cx = Math.round(camera.position.x / TILE_SIZE) * TILE_SIZE;
    const cz = Math.round(camera.position.z / TILE_SIZE) * TILE_SIZE;
    const now = performance.now();
    const half = Math.ceil(FADE_RADIUS / TILE_SIZE);
    const tiles = tilesRef.current;

    // Add new tiles within view radius
    for (let x = -half; x <= half; x++) {
      for (let z = -half; z <= half; z++) {
        const px = cx + x * TILE_SIZE;
        const pz = cz + z * TILE_SIZE;
        const dist = Math.sqrt((px - camera.position.x) ** 2 + (pz - camera.position.z) ** 2);
        if (dist > FADE_RADIUS) continue;

        const key = `${Math.round(px * 100)}_${Math.round(pz * 100)}`;
        if (tiles.has(key)) continue;

        // Vary green
        const hash = Math.abs(Math.round(px * 73 + pz * 137)) % 100;
        const green = 0.1 + (hash / 100) * 0.08;
        const r = isDark ? 0.05 : 0.15;
        const g = isDark ? green : green * 3;
        const b = isDark ? 0.04 : 0.08;
        const colorKey = `${Math.round(g * 1000)}_${isDark ? "d" : "l"}`;
        if (!matCache.current.has(colorKey)) {
          matCache.current.set(colorKey, new THREE.MeshStandardMaterial({
            color: new THREE.Color(r, g, b),
            roughness: 0.85,
          }));
        }

        const mesh = new THREE.Mesh(geoRef.current, matCache.current.get(colorKey));
        mesh.position.set(px, -0.06, pz);
        mesh.scale.set(0, 0, 0);
        mesh.receiveShadow = true;
        groupRef.current.add(mesh);
        tiles.set(key, { mesh, born: now });
      }
    }

    // Animate tiles — pop in near, remove far
    const toRemove: string[] = [];
    tiles.forEach((tile, key) => {
      const dist = Math.sqrt(
        (tile.mesh.position.x - camera.position.x) ** 2 +
        (tile.mesh.position.z - camera.position.z) ** 2
      );

      if (dist > FADE_RADIUS + 1) {
        // Too far — remove
        groupRef.current!.remove(tile.mesh);
        toRemove.push(key);
        return;
      }

      // Pop-in animation
      const age = now - tile.born;
      const t = Math.min(age / 350, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      // Fade out at edges
      const edgeFade = dist > VIEW_RADIUS ? Math.max(0, 1 - (dist - VIEW_RADIUS) / (FADE_RADIUS - VIEW_RADIUS)) : 1;
      const s = eased * edgeFade;

      tile.mesh.scale.set(s, s, s);
      tile.mesh.position.y = -0.06 + s * 0.06;
    });

    toRemove.forEach((k) => tiles.delete(k));
  });

  return <group ref={groupRef} />;
}

/* ═══════════════════════════════════════════════
   DYNAMIC GRASS — only grows where tiles are, animates with them
   ═══════════════════════════════════════════════ */

/* Deterministic hash for stable random values per world position */
function seedRandom(x: number, z: number, salt: number): number {
  const n = Math.sin(x * 127.1 + z * 311.7 + salt * 73.3) * 43758.5453;
  return n - Math.floor(n);
}

function DynamicGrass({ isDark = true }: { isDark?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 800;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { camera } = useThree();
  const prevBladesRef = useRef("");

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const camX = camera.position.x;
    const camZ = camera.position.z;

    // Only recalculate which tiles have grass when camera moves significantly
    const camKey = `${Math.round(camX * 2)}_${Math.round(camZ * 2)}`;
    const needsUpdate = camKey !== prevBladesRef.current;

    let bladeIdx = 0;
    const half = Math.ceil(VIEW_RADIUS / TILE_SIZE);
    const cx = Math.round(camX / TILE_SIZE) * TILE_SIZE;
    const cz = Math.round(camZ / TILE_SIZE) * TILE_SIZE;

    for (let tx = -half; tx <= half && bladeIdx < count; tx++) {
      for (let tz = -half; tz <= half && bladeIdx < count; tz++) {
        const tileX = cx + tx * TILE_SIZE;
        const tileZ = cz + tz * TILE_SIZE;
        const dist = Math.sqrt((tileX - camX) ** 2 + (tileZ - camZ) ** 2);

        if (dist > VIEW_RADIUS) continue;
        if (Math.abs(tileX) < 1.4 && Math.abs(tileZ) < 0.7) continue;

        // Use world-position-based seed so blades are always in the same spot for the same tile
        const tileKey = Math.round(tileX * 100) + Math.round(tileZ * 100) * 10000;
        const bladesPerTile = 2 + (Math.abs(tileKey) % 2);

        for (let b = 0; b < bladesPerTile && bladeIdx < count; b++) {
          // Deterministic random offsets per blade based on tile world position
          const offX = (seedRandom(tileX, tileZ, b * 3 + 1) - 0.5) * TILE_SIZE * 0.85;
          const offZ = (seedRandom(tileX, tileZ, b * 3 + 2) - 0.5) * TILE_SIZE * 0.85;
          const sy = 0.4 + seedRandom(tileX, tileZ, b * 3 + 3) * 1.0;
          const rot = seedRandom(tileX, tileZ, b * 3 + 4) * Math.PI;
          const phase = seedRandom(tileX, tileZ, b * 3 + 5) * Math.PI * 2;

          const gx = tileX + offX;
          const gz = tileZ + offZ;

          const edgeFade = dist > VIEW_RADIUS * 0.7
            ? Math.max(0, 1 - (dist - VIEW_RADIUS * 0.7) / (VIEW_RADIUS * 0.3))
            : 1;

          dummy.position.set(gx, 0.04, gz);
          // Wind sway — two wave frequencies for natural gusts
          const wind = Math.sin(time * 1.3 + phase + gx * 1.5) * 0.3 + Math.sin(time * 2.8 + gz * 2) * 0.12;
          dummy.rotation.set(wind * 0.3, rot, wind);
          dummy.scale.set(edgeFade, sy * edgeFade, edgeFade);
          dummy.updateMatrix();
          meshRef.current.setMatrixAt(bladeIdx, dummy.matrix);
          bladeIdx++;
        }
      }
    }

    for (let i = bladeIdx; i < count; i++) {
      dummy.scale.set(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (needsUpdate) prevBladesRef.current = camKey;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
        <coneGeometry args={[0.015, 0.12, 4]} />
        <meshStandardMaterial color={isDark ? "#1a4a1a" : "#3a8a3a"} roughness={0.8} />
      </instancedMesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════
   COFFEE SMOKE — particle system that rises and drifts
   ═══════════════════════════════════════════════ */

function CoffeeSmoke() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 15;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  // Each particle: phase offset, speed, drift
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      phase: (i / count) * Math.PI * 2,
      speed: 0.15 + Math.random() * 0.1,
      driftX: (Math.random() - 0.5) * 0.06,
      driftZ: (Math.random() - 0.5) * 0.04,
      size: 0.6 + Math.random() * 0.6,
    })),
  []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      // Cycle each particle continuously
      const life = ((time * p.speed + p.phase) % 1.5) / 1.5; // 0 → 1 over 1.5s cycle

      // Blender mug: (-0.8, 0.2, 0.83) → glTF: (-0.8, 0.83, -0.2) → rotated 180° Y: (0.8, 0.83, 0.2)
      // Top of mug rim is ~0.06 above center
      const baseX = 0.8;
      const baseY = 0.89;
      const baseZ = 0.2;

      dummy.position.set(
        baseX + p.driftX * life + Math.sin(time * 1.5 + p.phase) * 0.02,
        baseY + life * 0.25,
        baseZ + p.driftZ * life + Math.cos(time * 1.2 + p.phase) * 0.015,
      );

      // Grow then shrink, fade out at top
      const scale = (life < 0.3 ? life / 0.3 : 1 - (life - 0.3) / 0.7) * 0.025 * p.size;
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(0, time + p.phase, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#cccccc" transparent opacity={0.08} depthWrite={false} />
    </instancedMesh>
  );
}

/* ═══════════════════════════════════════════════
   RISING MOON — starts at horizon, slowly rises
   ═══════════════════════════════════════════════ */

function RisingCelestial({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const sunGltf = useGLTF("/models/sun.glb");
  const moonGltf = useGLTF("/models/moon.glb");
  const startTime = useRef(performance.now());

  useEffect(() => {
    if (!modelRef.current) return;
    // Dispose previous scene's GPU resources before replacing
    modelRef.current.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry?.dispose();
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else (mat as THREE.Material)?.dispose();
      }
    });
    while (modelRef.current.children.length) {
      modelRef.current.remove(modelRef.current.children[0]);
    }
    const scene = (isDark ? moonGltf : sunGltf).scene.clone(true);
    modelRef.current.add(scene);
  }, [isDark, sunGltf, moonGltf]);

  useFrame(() => {
    if (!groupRef.current || !modelRef.current) return;
    const elapsed = (performance.now() - startTime.current) / 1000;
    const targetY = Math.min(-1 + elapsed * 0.37, 4.5);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.02);
    modelRef.current.rotation.y += isDark ? 0.001 : 0.003;
  });

  return (
    <group ref={groupRef} position={[3, -1, -5]}>
      <group ref={modelRef} scale={isDark ? 0.8 : 0.6} />
      {/* Light illuminating the celestial body */}
      <pointLight intensity={isDark ? 8 : 1} color={isDark ? "#f0eee8" : "#ffffff"} distance={4} position={[0.5, 0.3, 1.5]} />
      {isDark && <pointLight intensity={3} color="#dde0f0" distance={3} position={[-0.5, -0.2, 1]} />}
      {isDark ? (
        <>
          <directionalLight intensity={1.2} color="#c8d8f0" castShadow />
          <pointLight intensity={1.5} color="#c0d0e8" distance={18} />
        </>
      ) : (
        <>
          <pointLight intensity={2} color="#ff9944" distance={12} />
          <directionalLight intensity={2.5} color="#fff8e0" castShadow />
          <pointLight intensity={3} color="#ffeedd" distance={25} />
        </>
      )}
    </group>
  );
}

/* ─── Clouds — float across the sky ─── */
function Clouds({ isDark }: { isDark: boolean }) {
  const cloudGltf = useGLTF("/models/cloud.glb");
  const groupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group[]>([]);

  const cloudData = useMemo(() =>
    Array.from({ length: isDark ? 3 : 6 }, (_, i) => ({
      x: (i - 3) * 2.5 + (Math.random() - 0.5) * 2,
      y: 3 + Math.random() * 2,
      z: -3 + (Math.random() - 0.5) * 4,
      scale: 0.3 + Math.random() * 0.4,
      speed: 0.05 + Math.random() * 0.08,
      phase: Math.random() * Math.PI * 2,
    })),
  [isDark]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    cloudsRef.current.forEach((cloud, i) => {
      if (!cloud) return;
      const d = cloudData[i];
      // Gentle drift
      cloud.position.x = d.x + Math.sin(time * d.speed + d.phase) * 1.5;
      cloud.position.y = d.y + Math.sin(time * 0.2 + d.phase) * 0.15;
    });
  });

  // Clone scenes once per cloudData change — clone materials too to avoid mutating cached GLTF
  const cloudScenes = useMemo(() =>
    cloudData.map(() => {
      const scene = cloudGltf.scene.clone(true);
      // Clone materials so we don't mutate the shared GLTF cache
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = (mesh.material as THREE.MeshStandardMaterial).clone();
          if (isDark) {
            (mesh.material as THREE.MeshStandardMaterial).color.multiplyScalar(0.3);
          }
        }
      });
      return scene;
    }),
  [cloudData, cloudGltf, isDark]);

  return (
    <group ref={groupRef}>
      {cloudData.map((d, i) => (
          <group
            key={`cloud-${i}`}
            ref={(el) => { if (el) cloudsRef.current[i] = el; }}
            position={[d.x, d.y, d.z]}
            scale={d.scale}
          >
            <primitive object={cloudScenes[i]} />
          </group>
      ))}
    </group>
  );
}

/* ─── Sunflowers — appear as you explore away from desk ─── */
const MAX_SUNFLOWERS = 20;

function Sunflowers() {
  const flowerGltf = useGLTF("/models/sunflower.glb");
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const placedRef = useRef<Map<string, { group: THREE.Group; targetScale: number; born: number }>>(new Map());

  // Pre-clone a pool of sunflower scenes (avoid cloning inside useFrame)
  const clonePool = useMemo(() =>
    Array.from({ length: MAX_SUNFLOWERS }, () => flowerGltf.scene.clone(true)),
  [flowerGltf]);
  const poolIndex = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;
    const camX = camera.position.x;
    const camZ = camera.position.z;

    const checkRadius = VIEW_RADIUS;
    for (let tx = -6; tx <= 6; tx++) {
      for (let tz = -6; tz <= 6; tz++) {
        const wx = Math.round(camX) + tx;
        const wz = Math.round(camZ) + tz;
        const dist = Math.sqrt((wx - camX) ** 2 + (wz - camZ) ** 2);

        if (dist > checkRadius) continue;
        const hash = Math.abs(Math.round(wx * 127 + wz * 311)) % 12;
        if (hash !== 0) continue;
        if (Math.abs(wx) < 2 && Math.abs(wz) < 1.5) continue;

        const key = `${wx}_${wz}`;
        if (placedRef.current.has(key)) continue;
        if (poolIndex.current >= MAX_SUNFLOWERS) continue;

        // Use pre-cloned scene from pool
        const scene = clonePool[poolIndex.current++];
        const group = new THREE.Group();
        group.add(scene);
        const flowerScale = 0.2 + seedRandom(wx, wz, 99) * 0.1;
        group.position.set(
          wx + (seedRandom(wx, wz, 1) - 0.5) * 0.4,
          0.30,
          wz + (seedRandom(wx, wz, 2) - 0.5) * 0.4,
        );
        group.rotation.y = seedRandom(wx, wz, 3) * Math.PI * 2;
        group.scale.setScalar(0);

        groupRef.current.add(group);
        placedRef.current.set(key, { group, targetScale: flowerScale, born: performance.now() });
      }
    }

    // Animate growth + remove far ones
    const toRemove: string[] = [];
    placedRef.current.forEach((entry, key) => {
      const dist = Math.sqrt(
        (entry.group.position.x - camX) ** 2 +
        (entry.group.position.z - camZ) ** 2,
      );
      if (dist > checkRadius + 2) {
        // Dispose cloned geometries/materials before removing
        entry.group.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.geometry?.dispose();
            const mat = mesh.material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else (mat as THREE.Material)?.dispose();
          }
        });
        groupRef.current!.remove(entry.group);
        toRemove.push(key);
        return;
      }
      // Grow in
      const age = (performance.now() - entry.born) / 1000;
      const t = Math.min(age / 0.6, 1);
      const s = entry.targetScale * (1 - Math.pow(1 - t, 3));
      entry.group.scale.setScalar(s);
    });
    toRemove.forEach((k) => placedRef.current.delete(k));
  });

  return <group ref={groupRef} />;
}

/* ═══════════════════════════════════════════════
   STICKY CONFIG
   ═══════════════════════════════════════════════ */

const STICKY_CONFIG = [
  { meshName: "Sticky_Apple", color: "#8ac9bd", expIndex: 0 },
  { meshName: "Sticky_AerDigital", color: "#61afef", expIndex: 1 },
  { meshName: "Sticky_IndDev", color: "#c678dd", expIndex: 2 },
];

/* ═══════════════════════════════════════════════
   WORKSPACE SCENE
   ═══════════════════════════════════════════════ */

function WorkspaceScene({
  experiences,
  selectedIndex,
  onReady,
  isDark,
}: {
  experiences: Experience[];
  selectedIndex: number | null;
  onReady: () => void;
  isDark: boolean;
}) {
  const gltf = useGLTF("/models/workspace.glb");
  const sceneRef = useRef<THREE.Group>(null);
  const readyFired = useRef(false);
  const [powerOn, setPowerOn] = useState(false);
  const monitorGlowRef = useRef(0);

  // Cached mesh refs — populated once on scene load, used every frame without traverse
  const monitorMat = useRef<THREE.MeshStandardMaterial | null>(null);
  const codeLineMats = useRef<{ mat: THREE.MeshStandardMaterial; idx: number }[]>([]);
  const stickyMats = useRef<{ mat: THREE.MeshStandardMaterial; expIndex: number }[]>([]);

  useEffect(() => {
    if (!gltf.scene || !sceneRef.current) return;
    const scene = gltf.scene.clone(true);
    while (sceneRef.current.children.length) {
      sceneRef.current.remove(sceneRef.current.children[0]);
    }
    sceneRef.current.add(scene);

    // Cache mesh material refs once instead of traversing every frame
    monitorMat.current = null;
    codeLineMats.current = [];
    stickyMats.current = [];

    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat?.emissive) return;

      if (mesh.name === "MonitorScreen" || mesh.name === "Cube.003") {
        monitorMat.current = mat;
      }
      if (mesh.name.startsWith("CodeLine")) {
        const idx = parseInt(mesh.name.split("_")[1] || "0");
        codeLineMats.current.push({ mat, idx });
      }
      const stickyConf = STICKY_CONFIG.find((s) => mesh.name === s.meshName);
      if (stickyConf) {
        stickyMats.current.push({ mat, expIndex: stickyConf.expIndex });
      }
    });

    let powerTimer: ReturnType<typeof setTimeout> | undefined;
    if (!readyFired.current) {
      readyFired.current = true;
      onReady();
      powerTimer = setTimeout(() => setPowerOn(true), 600);
    }
    return () => {
      if (powerTimer) clearTimeout(powerTimer);
      // Dispose cloned scene GPU resources on unmount
      scene.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          const mat = mesh.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else (mat as THREE.Material)?.dispose();
        }
      });
    };
  }, [gltf, onReady]);

  // Per-frame animation using cached refs — no traverse
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Monitor glow
    if (monitorMat.current) {
      if (powerOn) {
        monitorGlowRef.current = THREE.MathUtils.lerp(monitorGlowRef.current, 1, 0.02);
        const pulse = 0.15 * Math.sin(time * 1.5);
        monitorMat.current.emissiveIntensity = (3.5 + pulse) * monitorGlowRef.current;
      } else {
        monitorMat.current.emissiveIntensity = 0;
      }
    }

    // Code lines flicker
    for (const cl of codeLineMats.current) {
      if (powerOn) {
        const flicker = Math.sin(time * 2 + cl.idx * 1.3) > -0.3 ? 1 : 0.3;
        cl.mat.emissiveIntensity = 2.0 * flicker * monitorGlowRef.current;
      } else {
        cl.mat.emissiveIntensity = 0;
      }
    }

    // Sticky notes
    for (const sm of stickyMats.current) {
      const isSelected = selectedIndex === sm.expIndex;
      sm.mat.emissiveIntensity = THREE.MathUtils.lerp(sm.mat.emissiveIntensity, isSelected ? 0.8 : 0.15, 0.1);
    }
  });

  return (
    <>
      <group ref={sceneRef} rotation={[0, Math.PI, 0]} />

      {powerOn && (
        <Sparkles count={25} scale={4} size={0.8} speed={0.15} color="#8ac9bd" opacity={0.08} position={[0, 1.2, 0]} />
      )}

      <RisingCelestial isDark={isDark} />
      <Clouds isDark={isDark} />
      <Sunflowers />
      <DynamicGround isDark={isDark} />
      <DynamicGrass isDark={isDark} />
      {powerOn && <CoffeeSmoke />}
    </>
  );
}

/* ─── Camera ─── */
function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0.8, 1.3, 1.8);
    camera.lookAt(0, 0.8, 0);
  }, [camera]);
  return null;
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */

export function WorkspaceTheme({ experiences }: WorkspaceThemeProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (loaded || failed) return;
    const id = setInterval(() => {
      const s = Math.round((Date.now() - startRef.current) / 1000);
      setElapsed(s);
      if (s >= 20) { setFailed(true); clearInterval(id); }
    }, 500);
    return () => clearInterval(id);
  }, [loaded, failed]);

  const handleReady = useCallback(() => setLoaded(true), []);

  if (failed && !loaded) {
    return (
      <div className="mx-auto w-full max-w-3xl lg:max-w-4xl">
        <div className="flex min-h-[520px] flex-col items-center justify-center rounded-xl border border-border/20">
          <div className="text-sm font-bold tracking-[0.2em] text-muted">3D FAILED TO LOAD</div>
          <div className="mt-2 font-mono text-[10px] text-muted/60">Timed out after 20s</div>
          <button type="button"
            onClick={() => { setFailed(false); setLoaded(false); setElapsed(0); startRef.current = Date.now(); }}
            className="mt-4 rounded-lg border border-accent/30 px-4 py-2 font-mono text-xs text-accent hover:bg-accent/10">
            retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl lg:max-w-4xl">
      <div className="relative overflow-hidden rounded-xl" style={{ minHeight: 520 }}>
        {!loaded && !failed && (
          <div className="absolute inset-0 z-30 flex items-center justify-center" style={{ background: "rgba(10,10,12,0.95)" }}>
            <div className="w-64 text-center">
              <div className="text-sm font-bold tracking-[0.3em]" style={{ color: "var(--color-accent)" }}>LOADING 3D</div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border/20">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ background: "var(--color-accent)", width: `${Math.min((elapsed / 6) * 100, 95)}%` }} />
              </div>
              <div className="mt-2 font-mono text-[10px] text-muted">{elapsed}s</div>
            </div>
          </div>
        )}

        {loaded && (
          <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 font-mono text-[8px] text-muted/20">
            drag to explore · scroll to zoom
          </div>
        )}

        <Suspense fallback={null}>
          <Canvas
            key={isDark ? "dark" : "light"}
            shadows
            gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: isDark ? 0.9 : 1.4 }}
            style={{ background: isDark ? "#0a0a0c" : "#88bbdd", height: 520 }}
            dpr={[1, 2]}
          >
            <CameraSetup />
            <ambientLight intensity={isDark ? 0.1 : 0.6} />
            {/* Sky fill for light mode */}
            {!isDark && <hemisphereLight args={["#aaddff", "#88aa66", 0.5]} />}

            <rectAreaLight position={[0, 1.25, 0.5]} width={1.2} height={0.7} intensity={3} color="#1a8a9a" />
            <spotLight position={[-0.8, 1.3, 0.2]} angle={0.6} penumbra={0.5} intensity={8} color="#ffddaa" castShadow />
            <pointLight position={[0, 1.5, -1.5]} intensity={0.5} color="#8844bb" distance={6} />
            <directionalLight position={[2, 2, 3]} intensity={0.15} color="#aabbcc" />

            <WorkspaceScene
              experiences={experiences}
              selectedIndex={selectedIndex}
              onReady={handleReady}
              isDark={isDark}
            />

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              minDistance={1}
              maxDistance={8}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.2}
              autoRotate
              autoRotateSpeed={0.06}
              target={[0, 0.7, 0]}
              panSpeed={0.5}
              zoomSpeed={0.5}
            />
          </Canvas>
        </Suspense>
      </div>

      {loaded && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {experiences.map((exp, i) => {
            const color = STICKY_CONFIG[i]?.color || "#8ac9bd";
            const isSelected = selectedIndex === i;
            return (
              <button
                key={exp.id}
                type="button"
                onClick={() => setSelectedIndex(isSelected ? null : i)}
                className="rounded-xl p-4 text-left transition-all duration-200"
                style={{
                  background: isSelected ? `${color}12` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isSelected ? color + "40" : "rgba(255,255,255,0.05)"}`,
                  boxShadow: isSelected ? `0 0 20px ${color}15` : "none",
                }}
              >
                <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color }}>
                  {exp.organization} · {exp.period}
                </div>
                <div className="text-sm font-bold text-text">{exp.role}</div>
                {isSelected && (
                  <div className="mt-3 space-y-2">
                    <p className="text-[12px] leading-relaxed text-muted">{exp.summary}</p>
                    <ul className="space-y-1">
                      {exp.bullets.map((b) => (
                        <li key={b} className="text-[11px] leading-relaxed text-text/60">
                          <span style={{ color }}>▸ </span>{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

useGLTF.preload("/models/workspace.glb");
useGLTF.preload("/models/sun.glb");
useGLTF.preload("/models/moon.glb");
useGLTF.preload("/models/cloud.glb");
useGLTF.preload("/models/sunflower.glb");
