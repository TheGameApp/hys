"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import * as THREE from "three";

type ProgressValue = { current: number };

const SAND = "#e9cd94";
const BRASS = "#b08d57";

/* ================= Perfil del cristal (redondo) ================= */
// Radio interior del vidrio según |y|: [|y|, radio]
const HALF_KNOTS: [number, number][] = [
  [0, 0.22],
  [0.2, 0.6],
  [0.55, 1.05],
  [1.1, 1.22],
  [1.7, 1.24],
  [2.18, 1.28],
];

function profileRadius(y: number): number {
  const yy = Math.min(Math.abs(y), 2.18);
  for (let i = 0; i < HALF_KNOTS.length - 1; i++) {
    const [y0, r0] = HALF_KNOTS[i];
    const [y1, r1] = HALF_KNOTS[i + 1];
    if (yy >= y0 && yy <= y1) {
      const t = (yy - y0) / (y1 - y0);
      const s = (1 - Math.cos(Math.PI * t)) / 2;
      return r0 + (r1 - r0) * s;
    }
  }
  return 1.28;
}

const GLASS_PTS = Array.from({ length: 130 }, (_, i) => {
  const y = -2.18 + (4.36 * i) / 129;
  return new THREE.Vector2(profileRadius(y), y);
});

/* ================= Texturas procedurales (hebras de madera) ================= */
function makeWoodTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#4a3323";
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 260; i++) {
    const y = Math.random() * 256;
    const tone = 55 + Math.random() * 55;
    ctx.strokeStyle = `rgba(${tone}, ${tone * 0.55}, ${tone * 0.22}, ${
      0.12 + Math.random() * 0.28
    })`;
    ctx.lineWidth = 0.4 + Math.random() * 1.6;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 256; x += 12) {
      ctx.lineTo(x, y + Math.sin(x * 0.045 + Math.random() * 7) * 2.2);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

function makeBackdropTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
  g.addColorStop(0, "rgba(18, 24, 40, 0.92)");
  g.addColorStop(0.55, "rgba(10, 13, 24, 0.75)");
  g.addColorStop(1, "rgba(6, 8, 14, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

const WOOD_TEX = makeWoodTexture();
const BACKDROP_TEX = makeBackdropTexture();

/* ================= Geometrias y materiales compartidos ================= */
const OCTA_GEO = new THREE.OctahedronGeometry(0.05, 0);
const SAND_MAT = new THREE.MeshPhysicalMaterial({
  color: SAND,
  transmission: 0.6,
  thickness: 0.4,
  roughness: 0.16,
  metalness: 0.05,
  ior: 1.5,
  clearcoat: 0.8,
  transparent: true,
  opacity: 0.95,
  depthWrite: false,
  envMapIntensity: 1.4,
});

const BRASS_MAT = new THREE.MeshStandardMaterial({
  color: BRASS,
  metalness: 1,
  roughness: 0.32,
  envMapIntensity: 1.2,
});

const WOOD_MAT = new THREE.MeshStandardMaterial({
  map: WOOD_TEX,
  roughness: 0.5,
  metalness: 0,
});

const FRESNEL_VERT = `
varying vec3 vN;
varying vec3 vV;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const FRESNEL_FRAG = `
varying vec3 vN;
varying vec3 vV;
void main() {
  float f = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.5);
  gl_FragColor = vec4(0.85, 0.92, 1.0, f * 0.9);
}`;

const FRESNEL_UNIFORMS = { uColor: { value: new THREE.Color("#dbe9ff") } };

/* ================= Vidrio ================= */
function Glass() {
  return (
    <>
      <mesh>
        <latheGeometry args={[GLASS_PTS, 64]} />
        <meshPhysicalMaterial
          transmission={1}
          thickness={1.5}
          roughness={0.05}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.06}
          color="#e8f0fa"
          transparent
          depthWrite={false}
          envMapIntensity={1.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Borde fresnel para que el vidrio se vea redondo */}
      <mesh>
        <latheGeometry args={[GLASS_PTS, 64]} />
        <shaderMaterial
          args={[
            {
              uniforms: FRESNEL_UNIFORMS,
              vertexShader: FRESNEL_VERT,
              fragmentShader: FRESNEL_FRAG,
            },
          ]}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>
    </>
  );
}

/* ================= Marco: madera con hebras + detalles laton ================= */
function Frame() {
  const pillarAngles = useMemo(
    () => [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3],
    []
  );

  return (
    <group>
      {/* Bases de madera */}
      {[-2.2, 2.2].map((y) => (
        <group key={y}>
          <mesh position={[0, y, 0]}>
            <cylinderGeometry args={[1.32, 1.32, 0.16, 48]} />
            <primitive object={WOOD_MAT} attach="material" />
          </mesh>
          {/* Anillo de laton en el borde de la base */}
          <mesh position={[0, y + Math.sign(y) * 0.08, 0]}>
            <torusGeometry args={[1.32, 0.03, 16, 64]} />
            <primitive object={BRASS_MAT} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Pilares de madera */}
      {pillarAngles.map((a) => (
        <group key={a}>
          <mesh position={[Math.cos(a) * 1.28, 0, Math.sin(a) * 1.28]}>
            <cylinderGeometry args={[0.05, 0.05, 4.36, 16]} />
            <primitive object={WOOD_MAT} attach="material" />
          </mesh>
          {/* Virolas de laton */}
          {[-2.12, 2.12].map((y) => (
            <mesh
              key={y}
              position={[Math.cos(a) * 1.28, y, Math.sin(a) * 1.28]}
            >
              <cylinderGeometry args={[0.062, 0.062, 0.1, 16]} />
              <primitive object={BRASS_MAT} attach="material" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Anillo de laton en el cuello */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.24, 0.02, 16, 48]} />
        <primitive object={BRASS_MAT} attach="material" />
      </mesh>
    </group>
  );
}

/* ================= Monticulos de arena (cristales instanciados) =================
   side = -1 -> bulbo inferior (local -Y); side = +1 -> bulbo superior (local +Y) */
function CrystalPile({
  side,
  progressRef,
}: {
  side: -1 | 1;
  progressRef: RefObject<ProgressValue>;
}) {
  const COUNT = 520;
  const ref = useRef<THREE.InstancedMesh>(null);
  const seedRef = useRef<
    { u: number; theta: number; j: number; s: number; rot: number }[]
  >([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const RB = 1.0;
  const BASE = 2.0;
  const H_MAX = 1.7;

  useFrame(() => {
    if (seedRef.current.length === 0) {
      seedRef.current = Array.from({ length: COUNT }, () => ({
        u: Math.pow(Math.random(), 0.8),
        theta: Math.random() * Math.PI * 2,
        j: 0.6 + Math.random() * 0.4,
        s: 0.8 + Math.random() * 0.6,
        rot: Math.random() * Math.PI * 2,
      }));
    }
    const seed = seedRef.current;
    const p = progressRef.current.current;
    const f = side === -1 ? p : 1 - p; // fraccion de llenado
    const h = f * H_MAX;
    const visible = h > 0.06;
    const mesh = ref.current;
    if (!mesh) return;

    for (let i = 0; i < COUNT; i++) {
      const s = seed[i];
      const r = RB * s.u * s.j;
      // y desde el apex (cerca del cuello) hasta la base
      const y = BASE * side - side * h * (1 - s.u);
      dummy.position.set(Math.cos(s.theta) * r, y, Math.sin(s.theta) * r);
      dummy.rotation.set(0, s.rot, 0);
      dummy.scale.setScalar(visible ? s.s : 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[OCTA_GEO, SAND_MAT, COUNT]}
      frustumCulled={false}
    />
  );
}

/* ================= Particulas de arena con fisica (interactuan con el vidrio) ================= */
type SimP = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rest: number;
  rot: number;
};

const P_COUNT = 350;
const G = 12;
const RB = 1.0;
const H_MAX = 1.7;
const RESTITUTION = 0.35;

function SandParticles({
  progressRef,
}: {
  progressRef: RefObject<ProgressValue>;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const simRef = useRef<SimP[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, dt) => {
    const mesh = ref.current;
    if (!mesh) return;
    const tdt = Math.min(dt, 0.033); // estabilidad
    if (simRef.current.length === 0) {
      simRef.current = Array.from({ length: P_COUNT }, () => ({
        x: (Math.random() - 0.5) * 0.12,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 0.12,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.1,
        vz: (Math.random() - 0.5) * 0.05,
        rest: Math.random() * 1.2,
        rot: Math.random() * Math.PI * 2,
      }));
    }
    const sim = simRef.current;
    const p = progressRef.current.current;
    const c = Math.cos(p * Math.PI);
    const g = -c * G; // gravedad local (se invierte al voltear)
    const spawnY = c >= 0 ? 0.12 : -0.12;
    const vy0 = c >= 0 ? -0.25 : 0.25;

    const respawn = (P: SimP) => {
      P.x = (Math.random() - 0.5) * 0.14;
      P.z = (Math.random() - 0.5) * 0.14;
      P.y = spawnY;
      P.vx = (Math.random() - 0.5) * 0.05;
      P.vz = (Math.random() - 0.5) * 0.05;
      P.vy = vy0;
      P.rest = 0;
      P.rot = Math.random() * Math.PI * 2;
    };

    for (let i = 0; i < P_COUNT; i++) {
      const P = sim[i];
      if (P.rest > 0) {
        P.rest -= tdt;
        if (P.rest <= 0) respawn(P);
      } else {
        P.vy += g * tdt;
        const drag = 1 - 1.4 * tdt;
        P.vx *= drag;
        P.vy *= drag;
        P.vz *= drag;
        P.x += P.vx * tdt;
        P.y += P.vy * tdt;
        P.z += P.vz * tdt;

        // Colision con el cristal (bordes redondeados)
        const r = Math.hypot(P.x, P.z);
        const rmax = profileRadius(P.y) - 0.06;
        if (r > rmax && rmax > 0.03) {
          const nx = P.x / r;
          const nz = P.z / r;
          const vn = P.vx * nx + P.vz * nz;
          if (vn > 0) {
            P.vx -= 2 * vn * nx * RESTITUTION;
            P.vz -= 2 * vn * nz * RESTITUTION;
          }
          P.x = nx * rmax;
          P.z = nz * rmax;
        }

        // Tapas
        if (P.y < -2.02) {
          P.y = -2.02;
          if (P.vy < 0) P.vy = -P.vy * 0.3;
        }
        if (P.y > 2.02) {
          P.y = 2.02;
          if (P.vy > 0) P.vy = -P.vy * 0.3;
        }

        // Aterrizar sobre el monticulo activo
        const f = c > 0 ? p : 1 - p;
        const h = f * H_MAX;
        const rr = Math.min(r, RB);
        const surfY = c > 0 ? -2.0 + h * (1 - rr / RB) : 2.0 - h * (1 - rr / RB);
        if ((c > 0 && P.y < surfY) || (c < 0 && P.y > surfY)) {
          P.y = surfY;
          P.vy = 0;
          P.vx *= 0.6;
          P.vz *= 0.6;
          P.rest = 0.6 + Math.random() * 0.9;
        }

        // Seguridad
        if (P.y < -2.3 || P.y > 2.3) respawn(P);
      }

      dummy.position.set(P.x, P.y, P.z);
      dummy.rotation.set(0, P.rot, 0);
      dummy.scale.setScalar(0.9);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[OCTA_GEO, SAND_MAT, P_COUNT]}
      frustumCulled={false}
    />
  );
}

/* ================= Conjunto + volteo por scroll ================= */
function HourglassModel({
  progressRef,
}: {
  progressRef: RefObject<ProgressValue>;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current!.rotation.z = progressRef.current.current * Math.PI;
    group.current!.position.y = Math.sin(t * 0.8) * 0.05;
  });

  return (
    <group ref={group}>
      <Glass />
      <Frame />
      <CrystalPile side={-1} progressRef={progressRef} />
      <CrystalPile side={1} progressRef={progressRef} />
      <SandParticles progressRef={progressRef} />
    </group>
  );
}

/* ================= Canvas ================= */
export default function HourglassScene({
  progressRef,
}: {
  progressRef: RefObject<ProgressValue>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 2.2, 6.4], fov: 38 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Fondo oscuro que el vidrio refracta */}
      <mesh position={[0, 0, -3]}>
        <planeGeometry args={[16, 16]} />
        <meshBasicMaterial map={BACKDROP_TEX} transparent depthWrite={false} />
      </mesh>

      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 4]} intensity={1.3} />
      <directionalLight position={[-4, -2, -4]} intensity={0.45} color="#9db8ff" />
      <Environment resolution={64}>
        <Lightformer
          intensity={2.5}
          position={[0, 6, 0]}
          rotation-x={Math.PI / 2}
          scale={[8, 8, 1]}
        />
        <Lightformer
          intensity={1.3}
          position={[-6, 1, 2]}
          rotation-y={Math.PI / 2}
          scale={[8, 2, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={1.3}
          position={[6, 1, 2]}
          rotation-y={-Math.PI / 2}
          scale={[8, 2, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={0.8}
          position={[0, -6, 0]}
          rotation-x={-Math.PI / 2}
          scale={[8, 8, 1]}
          color="#8fa8d8"
        />
      </Environment>
      <HourglassModel progressRef={progressRef} />
    </Canvas>
  );
}
