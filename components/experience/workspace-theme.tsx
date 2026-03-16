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
const VIEW_RADIUS = 8;
const FADE_RADIUS = 10;

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

      // Cursor highlight — tiles near mouse glow brighter
      const mouseDist = Math.sqrt(
        (tile.mesh.position.x - mouseGroundRef.current.x) ** 2 +
        (tile.mesh.position.z - mouseGroundRef.current.z) ** 2,
      );
      const mat = tile.mesh.material as THREE.MeshStandardMaterial;
      if (mouseDist < 1.5) {
        const glow = (1 - mouseDist / 1.5) * 0.3;
        mat.emissive.setRGB(glow * 0.3, glow, glow * 0.3);
        mat.emissiveIntensity = 1;
      } else {
        mat.emissiveIntensity = 0;
      }
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

/* ─── Clouds — fluffy spheres grouped together (GLB was broken — 500k units off origin) ─── */
function Clouds({ isDark }: { isDark: boolean }) {
  const cloudCount = isDark ? 3 : 5;
  const cloudData = useMemo(() =>
    Array.from({ length: cloudCount }, (_, i) => ({
      x: (i - 2) * 3.5 + seedRandom(i, 0, 10) * 2,
      y: 2.5 + seedRandom(i, 0, 11) * 1,
      z: -2 + seedRandom(i, 0, 12) * 4,
      scale: 0.6 + seedRandom(i, 0, 13) * 0.4,
      speed: 0.02 + seedRandom(i, 0, 14) * 0.03,
      phase: seedRandom(i, 0, 15) * Math.PI * 2,
    })),
  [cloudCount]);

  const cloudColor = isDark ? "#3a3a4a" : "#ffffff";
  const cloudEmissive = isDark ? "#1a1a2a" : "#888888";

  return (
    <group>
      {cloudData.map((d, i) => (
        <CloudPuff key={`cloud-${i}`} data={d} color={cloudColor} emissive={cloudEmissive} />
      ))}
    </group>
  );
}

function CloudPuff({ data, color, emissive }: { data: { x: number; y: number; z: number; scale: number; speed: number; phase: number }; color: string; emissive: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.position.x = data.x + Math.sin(time * data.speed + data.phase) * 2;
    groupRef.current.position.y = data.y + Math.sin(time * 0.15 + data.phase) * 0.15;
  });

  // Each cloud is 3-5 overlapping spheres
  const puffs = useMemo(() => {
    const count = 3 + Math.floor(seedRandom(data.x, data.z, 20) * 3);
    return Array.from({ length: count }, (_, i) => ({
      x: (seedRandom(data.x, data.z, 30 + i) - 0.5) * 0.8,
      y: (seedRandom(data.x, data.z, 40 + i) - 0.5) * 0.3,
      z: (seedRandom(data.x, data.z, 50 + i) - 0.5) * 0.4,
      r: 0.25 + seedRandom(data.x, data.z, 60 + i) * 0.2,
    }));
  }, [data.x, data.z]);

  return (
    <group ref={groupRef} position={[data.x, data.y, data.z]} scale={data.scale}>
      {puffs.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.r, 12, 12]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.3} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Sunflowers — spawn across the whole ground, not just near camera ─── */
const MAX_SUNFLOWERS = 50;

function Sunflowers() {
  const flowerGltf = useGLTF("/models/sunflower.glb");
  const groupRef = useRef<THREE.Group>(null);
  const [spawned, setSpawned] = useState(false);

  // Pre-clone a pool
  const clonePool = useMemo(() =>
    Array.from({ length: MAX_SUNFLOWERS }, () => flowerGltf.scene.clone(true)),
  [flowerGltf]);

  // Spawn sunflowers at truly random positions — not on a grid
  useEffect(() => {
    if (!groupRef.current || spawned) return;

    for (let i = 0; i < MAX_SUNFLOWERS; i++) {
      // Use deterministic random based on index for stable positions
      const angle = seedRandom(i, 0, 1) * Math.PI * 2;
      const radius = 2.5 + seedRandom(i, 0, 2) * 6.5; // 2.5 to 9 units from center
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Skip if too close to desk
      if (Math.abs(x) < 2 && Math.abs(z) < 1.5) continue;

      const scene = clonePool[i];
      if (!scene) break;
      const group = new THREE.Group();
      group.add(scene);
      const flowerScale = 0.15 + seedRandom(i, 0, 3) * 0.15;
      group.position.set(x, 0.30, z);
      group.rotation.y = seedRandom(i, 0, 4) * Math.PI * 2;
      group.scale.setScalar(flowerScale);
      groupRef.current.add(group);
    }
    setSpawned(true);
  }, [clonePool, spawned]);

  return <group ref={groupRef} />;
}

/* ═══════════════════════════════════════════════
   STICKY CONFIG
   ═══════════════════════════════════════════════ */

// Shared state refs used by multiple components
const orbitTargetRef = { current: new THREE.Vector3(0, 0.7, 0) };
const mouseGroundRef = { current: new THREE.Vector3(0, 0, 0) }; // where mouse hits the ground plane

/* ─── Mouse-to-ground raycast — updates mouseGroundRef every frame ─── */
function MouseGroundTracker() {
  const { camera, pointer } = useThree();
  const _ray = useRef(new THREE.Raycaster());
  const _plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const _intersect = useRef(new THREE.Vector3());

  useFrame(() => {
    _ray.current.setFromCamera(pointer, camera);
    if (_ray.current.ray.intersectPlane(_plane.current, _intersect.current)) {
      mouseGroundRef.current.copy(_intersect.current);
    }
  });

  return null;
}

/* ─── Desk Fader — desk fades out when orbit target moves away from center ─── */
function DeskFader({ sceneRef }: { sceneRef: React.RefObject<THREE.Group | null> }) {
  const DESK_FADE_START = 3;
  const DESK_FADE_END = 5;
  const cachedMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const initialized = useRef(false);

  // Cache materials once instead of traversing every frame
  useFrame(() => {
    if (!sceneRef.current) return;

    if (!initialized.current) {
      initialized.current = true;
      cachedMats.current = [];
      sceneRef.current.traverse((child) => {
        if (child.name.startsWith("Sticky")) {
          child.visible = false;
          return;
        }
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.transparent = true;
            cachedMats.current.push(mat);
          }
        }
      });
    }

    const dist = Math.sqrt(
      orbitTargetRef.current.x ** 2 + orbitTargetRef.current.z ** 2,
    );

    let opacity = 1;
    if (dist > DESK_FADE_START) {
      opacity = Math.max(0, 1 - (dist - DESK_FADE_START) / (DESK_FADE_END - DESK_FADE_START));
    }

    for (const mat of cachedMats.current) {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, opacity, 0.1);
    }
  });

  return <group ref={sceneRef} rotation={[0, Math.PI, 0]} />;
}

/* ═══════════════════════════════════════════════
   WORKSPACE SCENE
   ═══════════════════════════════════════════════ */

function WorkspaceScene({
  experiences,
  onReady,
  isDark,
}: {
  experiences: Experience[];
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
      // Hide sticky notes + their curls
      if (child.name.startsWith("Sticky")) {
        child.visible = false;
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

  });

  return (
    <>
      <DeskFader sceneRef={sceneRef} />

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

/* ─── Orbit with click-to-focus ───
   Orbit controls as default (intuitive drag/scroll).
   Click on any point in the world → orbit target smoothly shifts there.
   The camera glides to orbit the new focus point.
*/
function SmartOrbitControls() {
  const { camera, gl, raycaster, pointer } = useThree();
  const controlsRef = useRef<any>(null);
  const targetPos = useRef(new THREE.Vector3(0, 0.7, 0));
  const currentTarget = useRef(new THREE.Vector3(0, 0.7, 0));
  const isAnimating = useRef(false);
  const clickRay = useRef(new THREE.Raycaster());
  const clickVec = useRef(new THREE.Vector2());

  useEffect(() => {
    camera.position.set(0.8, 1.3, 1.8);
  }, [camera]);

  // Click handler — raycast to find where on the ground the user clicked
  useEffect(() => {
    const canvas = gl.domElement;
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectPoint = new THREE.Vector3();

    const onClick = (e: MouseEvent) => {
      // Only on short clicks (not drag)
      if (e.detail > 1) return; // ignore double-clicks

      // Calculate mouse position in normalized device coords
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Cast ray from camera through click point (reuse refs, no per-click allocation)
      clickRay.current.setFromCamera(clickVec.current.set(x, y), camera);

      // Intersect with ground plane at y=0
      if (clickRay.current.ray.intersectPlane(groundPlane, intersectPoint)) {
        // Clamp to reasonable bounds
        intersectPoint.x = Math.max(-10, Math.min(10, intersectPoint.x));
        intersectPoint.z = Math.max(-10, Math.min(10, intersectPoint.z));
        intersectPoint.y = 0.5; // look slightly above ground

        targetPos.current.copy(intersectPoint);
        isAnimating.current = true;
      }
    };

    // Use a timeout to distinguish click from drag
    let downTime = 0;
    const onDown = () => { downTime = Date.now(); };
    const onUp = (e: MouseEvent) => {
      if (Date.now() - downTime < 200) onClick(e);
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp as EventListener);

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp as EventListener);
    };
  }, [camera, gl]);

  // Smoothly animate the orbit target toward the clicked position
  useFrame(() => {
    if (!controlsRef.current) return;

    if (isAnimating.current) {
      currentTarget.current.lerp(targetPos.current, 0.04);
      controlsRef.current.target.copy(currentTarget.current);
      orbitTargetRef.current.copy(currentTarget.current);

      // Stop animating when close enough
      if (currentTarget.current.distanceTo(targetPos.current) < 0.01) {
        isAnimating.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      minDistance={1}
      maxDistance={14}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.2}
      autoRotate={!isAnimating.current}
      autoRotateSpeed={0.08}
      target={[0, 0.7, 0]}
      panSpeed={0.5}
      zoomSpeed={0.5}
    />
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */

export function WorkspaceTheme({ experiences }: WorkspaceThemeProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (loaded || failed) return;
    const id = setInterval(() => {
      const s = Math.round((Date.now() - startRef.current) / 1000);
      setElapsed(s);
      if (s >= 45) { setFailed(true); clearInterval(id); }
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
          <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 font-mono text-[8px] text-muted/30">
            drag to orbit · scroll to zoom · right-drag to pan
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
            <SmartOrbitControls />
            <MouseGroundTracker />
            <ambientLight intensity={isDark ? 0.1 : 0.6} />
            {/* Sky fill for light mode */}
            {!isDark && <hemisphereLight args={["#aaddff", "#88aa66", 0.5]} />}

            <rectAreaLight position={[0, 1.25, 0.5]} width={1.2} height={0.7} intensity={3} color="#1a8a9a" />
            <spotLight position={[-0.8, 1.3, 0.2]} angle={0.6} penumbra={0.5} intensity={8} color="#ffddaa" castShadow />
            <pointLight position={[0, 1.5, -1.5]} intensity={0.5} color="#8844bb" distance={6} />
            <directionalLight position={[2, 2, 3]} intensity={0.15} color="#aabbcc" />

            <WorkspaceScene
              experiences={experiences}
              onReady={handleReady}
              isDark={isDark}
            />

          </Canvas>
        </Suspense>
      </div>

    </div>
  );
}

useGLTF.preload("/models/workspace.glb");
useGLTF.preload("/models/sun.glb");
useGLTF.preload("/models/moon.glb");
// cloud.glb removed — vertices were 500k units off origin. Using procedural clouds instead.
useGLTF.preload("/models/sunflower.glb");
