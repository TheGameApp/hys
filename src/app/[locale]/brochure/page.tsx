"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const HourglassScene = dynamic(
  () => import("@/components/three/spline-hourglass"),
  { ssr: false }
);

const C = {
  dark: "#000000",
  dark2: "#141B19",
  paper: "#F0F2F1",
  surface: "#FBFCFB",
  ink: "#F2F7F4",
  ink2: "rgba(255,255,255,0.18)",
  muted: "#B7C4BF",
  rule: "rgba(255,255,255,0.10)",
  emerald: "#2FC98F",
  emeraldLight: "#3FCB92",
  emeraldWash: "#DCEDE5",
  violet: "#A78BFA",
  violetBg: "#34155C",
  violetWash: "#F5EFFC",
  amber: "#E0A62E",
  red: "#F0655A",
  redWash: "#F6E3E1",
  lightText: "#EAF2EE",
  lightMuted: "#9FB2AA",
  lightMuted2: "#B7C4BF",
  darkMuted: "#6E837A",
} as const;

function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 35%, rgba(12,17,16,0.6) 100%)",
        borderColor: "rgba(255,255,255,0.10)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({
  children,
  color = C.emerald,
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <p
      className="font-mono text-[0.68rem] uppercase tracking-[0.2em] mb-6"
      style={{ color }}
    >
      {children}
    </p>
  );
}

function Mono({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`font-mono ${className}`} style={style}>
      {children}
    </span>
  );
}

function Divider({ color = C.rule }: { color?: string }) {
  return <div className="h-px w-full" style={{ background: color }} />;
}

export default function BrochurePage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<{ current: number }>({ current: 0 });

  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  });
  const spring = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.6,
  });
  useMotionValueEvent(spring, "change", (v) => {
    progressRef.current.current = v;
  });

  return (
    <>
      <Navbar />
      <main ref={mainRef} className="relative overflow-x-hidden">
        <div className="relative z-10">
          {/* ═══════════════════════════════════════════════════
              1 — PORTADA: animación del reloj + copy desde la web
          ═══════════════════════════════════════════════════ */}
          <section
            className="relative min-h-screen flex flex-col justify-center"
            style={{ background: "#000000" }}
          >
            <div className="relative w-full px-6 sm:px-8 lg:px-16 pt-24 sm:pt-28">
              {/* Animación: pointer-events-none para que NO se mueva al tocarla
                  (sin orbit/zoom táctil) y la página scrollee normal */}
              <div className="pointer-events-none [&_canvas]:pointer-events-none">
                <HourglassScene progressRef={progressRef} totalSections={7} />
              </div>
              {/* halo sutil para legibilidad del copy sobre el 3D */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 65% 55% at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 72%)",
                }}
              />
              {/* copy encima de la animación */}
              <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none">
                <div className="max-w-3xl w-full text-center">
                  <p
                    className="font-serif leading-[1.2] tracking-[-0.015em]"
                    style={{
                      color: C.ink,
                      fontSize: "clamp(1.4rem, 4.5vw, 2.5rem)",
                      textShadow: "0 2px 28px rgba(0,0,0,0.6)",
                    }}
                  >
                    No vendemos inteligencia artificial.
                  </p>
                  <p
                    className="font-serif leading-[1.2] tracking-[-0.015em] mt-4"
                    style={{
                      color: C.emerald,
                      fontSize: "clamp(1.4rem, 4.5vw, 2.5rem)",
                      textShadow: "0 2px 28px rgba(0,0,0,0.6)",
                    }}
                  >
                    Vendemos horas que su empresa deja de perder.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              2 — LA PREGUNTA + STATS
          ═══════════════════════════════════════════════════ */}
          <section
            className="min-h-screen flex items-center justify-center px-4 sm:px-5 py-20 sm:py-28"
            style={{ background: "#000000" }}
          >
            <div className="max-w-5xl w-full">
              <GlassPanel className="p-5 sm:p-10 md:p-14">
                <SectionLabel>La cuenta que nadie le muestra</SectionLabel>

                <h2
                  className="font-serif leading-[1.1] tracking-[-0.02em] max-w-3xl"
                  style={{
                    color: C.ink,
                    fontSize: "clamp(1.5rem, 4vw, 3rem)",
                  }}
                >
                  ¿Cuántas horas al mes gasta su equipo pasando información de un
                  sistema a otro?
                </h2>

                <p
                  className="mt-6 text-base sm:text-lg leading-relaxed max-w-2xl"
                  style={{
                    color: C.muted,
                    borderLeft: `3px solid ${C.emerald}`,
                    paddingLeft: "1.25rem",
                  }}
                >
                  Si no tiene ese número, ningún proveedor puede prometerle un
                  retorno. Y el que se lo prometa, se lo está inventando.
                </p>

                <div
                  className="mt-10 p-5 sm:p-8 rounded-xl"
                  style={{ background: "rgba(47,201,143,0.08)" }}
                >
                  <p
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ color: C.ink }}
                  >
                    En 2026 Uber consumió todo su presupuesto anual de inteligencia
                    artificial en cuatro meses. Su director de operaciones admitió
                    que no podía demostrar que ese gasto se hubiera traducido en algo
                    para el cliente.
                  </p>
                  <p
                    className="mt-4 font-serif text-xl sm:text-2xl font-medium"
                    style={{ color: C.emerald }}
                  >
                    No es un caso aislado.
                  </p>
                </div>
              </GlassPanel>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    n: "80%",
                    t: "de las empresas no ve impacto medible en sus resultados por el uso de IA generativa.",
                  },
                  {
                    n: "42%",
                    t: "abandonó la mayoría de sus proyectos de IA antes de ponerlos en producción. El año anterior era 17%.",
                  },
                  {
                    n: "40%",
                    t: "de los proyectos de agentes de IA se cancelarán antes de que termine 2027.",
                  },
                ].map((s) => (
                  <GlassPanel key={s.n} className="p-5 sm:p-7">
                    <p
                      className="font-mono tracking-[-0.05em] leading-none"
                      style={{
                        color: C.emerald,
                        fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
                      }}
                    >
                      {s.n}
                    </p>
                    <div
                      className="w-8 h-[2px] mt-5 mb-4"
                      style={{ background: C.emerald, opacity: 0.4 }}
                    />
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: C.muted }}
                    >
                      {s.t}
                    </p>
                  </GlassPanel>
                ))}
              </div>

              <p
                className="mt-6 font-mono text-[0.62rem] tracking-wide"
                style={{ color: C.muted }}
              >
                McKinsey, The State of AI · S&amp;P Global, Voice of the Enterprise ·
                Gartner, junio 2025 · Fortune, mayo 2026
              </p>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              3 — POR QUÉ PASA ESTO
          ═══════════════════════════════════════════════════ */}
          <section
            className="min-h-screen flex items-center justify-center px-4 sm:px-5 py-20 sm:py-28"
            style={{ background: "#000000" }}
          >
            <div className="max-w-5xl w-full">
              <GlassPanel className="p-5 sm:p-10 md:p-14">
                <SectionLabel>Por qué pasa esto</SectionLabel>

                <h2
                  className="font-serif leading-[1.1] tracking-[-0.02em]"
                  style={{
                    color: C.ink,
                    fontSize: "clamp(1.5rem, 4vw, 3rem)",
                  }}
                >
                  Se compra tecnología antes de{" "}
                  <span style={{ color: C.emerald }}>entender el problema.</span>
                </h2>

                <p
                  className="mt-5 text-base sm:text-lg leading-relaxed max-w-3xl"
                  style={{ color: C.muted }}
                >
                  El presupuesto va donde está la emoción — marketing, chatbots, «el
                  agente» — y el ahorro real está en las tareas administrativas que
                  nadie quiere mostrar.
                </p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div
                    className="p-5 sm:p-7 rounded-xl border"
                    style={{
                      borderColor: C.rule,
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <p
                      className="font-serif text-xl sm:text-2xl font-medium leading-snug"
                      style={{ color: C.ink }}
                    >
                      Y de la sensación de mejora no hay que fiarse.
                    </p>
                    <p
                      className="mt-4 text-sm leading-relaxed"
                      style={{ color: C.muted }}
                    >
                      En un experimento controlado, profesionales con experiencia
                      tardaron{" "}
                      <Mono className="font-semibold" style={{ color: C.ink }}>
                        19% más
                      </Mono>{" "}
                      usando herramientas de IA. Al terminar estaban convencidos de
                      haber sido{" "}
                      <Mono className="font-semibold" style={{ color: C.ink }}>
                        20% más rápidos
                      </Mono>
                      .
                    </p>
                    <p
                      className="mt-5 font-mono text-[0.62rem] tracking-wide"
                      style={{ color: C.muted }}
                    >
                      METR, ensayo controlado aleatorizado, 2025
                    </p>
                  </div>

                  <div
                    className="p-5 sm:p-7 rounded-xl border"
                    style={{
                      borderColor: C.rule,
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <p
                      className="font-serif text-xl sm:text-2xl font-medium leading-snug"
                      style={{ color: C.ink }}
                    >
                      Y ahora hay un plazo
                    </p>
                    <p
                      className="mt-4 text-sm leading-relaxed"
                      style={{ color: C.muted }}
                    >
                      El reglamento de la{" "}
                      <strong style={{ color: C.ink }}>Ley 31814</strong> de
                      inteligencia artificial rige desde enero de 2026. Salud,
                      educación, justicia, seguridad, economía y finanzas tienen
                      hasta el{" "}
                      <Mono className="font-semibold" style={{ color: C.red }}>
                        10 de septiembre de 2026
                      </Mono>{" "}
                      para cumplir las obligaciones de transparencia algorítmica.
                      Antes de cumplir hay que saber qué sistemas se están usando y
                      con qué datos. Muchas empresas no lo saben, porque su gente
                      adoptó herramientas por su cuenta.
                    </p>
                    <p
                      className="mt-5 font-mono text-[0.62rem] tracking-wide"
                      style={{ color: C.muted }}
                    >
                      DS 115-2025-PCM, reglamento de la Ley 31814
                    </p>
                  </div>
                </div>

                <div
                  className="mt-8 p-5 sm:p-8 rounded-xl"
                  style={{ background: "rgba(47,201,143,0.10)" }}
                >
                  <p
                    className="font-serif text-xl sm:text-3xl font-medium"
                    style={{ color: C.emerald }}
                  >
                    Nuestra postura
                  </p>
                  <ul className="mt-6 space-y-4">
                    {[
                      "Empezamos por el proceso, no por la tecnología.",
                      "La IA es una herramienta, no el objetivo.",
                      "Si no se puede medir, no lo proponemos.",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm sm:text-lg"
                        style={{ color: C.ink }}
                      >
                        <span
                          className="inline-block w-2 h-2 rounded-full mt-2 shrink-0"
                          style={{ background: C.emerald }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassPanel>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              4 — CÓMO TRABAJAMOS
          ═══════════════════════════════════════════════════ */}
          <section
            className="min-h-screen flex items-center justify-center px-4 sm:px-5 py-20 sm:py-28"
            style={{ background: "#000000" }}
          >
            <div className="max-w-5xl w-full">
              <GlassPanel className="p-5 sm:p-10 md:p-14">
                <SectionLabel>Cómo trabajamos</SectionLabel>

                <h2
                  className="font-serif leading-[1.1] tracking-[-0.02em]"
                  style={{
                    color: C.ink,
                    fontSize: "clamp(1.5rem, 4vw, 3rem)",
                  }}
                >
                  Cuatro pasos, medidos.
                </h2>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      n: "01",
                      t: "Radiografía",
                      d: "Mapeamos cómo trabaja su empresa de verdad, no como dice el manual.",
                    },
                    {
                      n: "02",
                      t: "Cuantificación",
                      d: "A cada tarea repetitiva le ponemos horas al mes y costo al mes.",
                    },
                    {
                      n: "03",
                      t: "Decisión",
                      d: "Cada proceso sale con una etiqueta y su justificación.",
                    },
                    {
                      n: "04",
                      t: "Piloto medido",
                      d: "Un proceso, un indicador acordado antes de empezar, 30 a 45 días.",
                    },
                  ].map((p) => (
                    <div
                      key={p.n}
                      className="p-4 sm:p-5 rounded-xl border"
                      style={{
                        borderColor: C.rule,
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <Mono
                        className="text-xs tracking-[0.2em]"
                        style={{ color: C.emerald }}
                      >
                        {p.n}
                      </Mono>
                      <p
                        className="mt-3 font-serif text-lg sm:text-xl"
                        style={{ color: C.ink }}
                      >
                        {p.t}
                      </p>
                      <p
                        className="mt-2 text-sm leading-relaxed"
                        style={{ color: C.muted }}
                      >
                        {p.d}
                      </p>
                    </div>
                  ))}
                </div>

                <Divider />

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      dot: C.emeraldLight,
                      label: "Automatizar",
                      d: "Alto volumen, reglas claras, el error sale caro. Conviene, y se puede calcular cuánto.",
                    },
                    {
                      dot: C.amber,
                      label: "Simplificar primero",
                      d: "El proceso está mal diseñado. Automatizarlo solo haría el desorden más rápido. Muchas veces se arregla sin IA.",
                    },
                    {
                      dot: C.red,
                      label: "Dejar manual",
                      d: "Bajo volumen, mucho criterio. Automatizarlo cuesta más de lo que ahorra.",
                    },
                  ].map((c) => (
                    <div
                      key={c.label}
                      className="p-4 sm:p-5 rounded-xl border"
                      style={{
                        borderColor: C.rule,
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-block w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ background: c.dot }}
                        />
                        <p
                          className="font-serif text-lg sm:text-xl font-semibold"
                          style={{ color: c.dot }}
                        >
                          {c.label}
                        </p>
                      </div>
                      <p
                        className="mt-3 text-sm leading-relaxed"
                        style={{ color: C.muted }}
                      >
                        {c.d}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              5 — EJEMPLO CON NÚMEROS
          ═══════════════════════════════════════════════════ */}
          <section
            className="min-h-screen flex items-center justify-center px-4 sm:px-5 py-20 sm:py-28"
            style={{ background: "#000000" }}
          >
            <div className="max-w-4xl w-full">
              <GlassPanel className="p-5 sm:p-10 md:p-14">
                <SectionLabel>Un ejemplo, con números</SectionLabel>

                <h2
                  className="font-serif leading-[1.1] tracking-[-0.02em]"
                  style={{
                    color: C.ink,
                    fontSize: "clamp(1.5rem, 4vw, 3rem)",
                  }}
                >
                  La cuenta que sí mostramos.
                </h2>

                <div
                  className="mt-10 rounded-xl border-2 overflow-hidden"
                  style={{
                    borderColor: C.emerald,
                    background: "rgba(47,201,143,0.06)",
                  }}
                >
                  <div
                    className="p-4 sm:p-8 font-mono text-xs sm:text-sm"
                    style={{ color: C.ink }}
                  >
                    <div
                      className="flex flex-wrap justify-between gap-x-4 py-3 border-b"
                      style={{ borderColor: "rgba(11,138,94,0.2)" }}
                    >
                      <span>Digitación de pedidos</span>
                      <span className="font-semibold tabular-nums">139 h/mes</span>
                    </div>
                    <div
                      className="flex flex-wrap justify-between gap-x-4 py-3 border-b"
                      style={{ borderColor: "rgba(11,138,94,0.2)" }}
                    >
                      <span>Conciliación de guías</span>
                      <span className="font-semibold tabular-nums">55 h/mes</span>
                    </div>
                    <div className="flex flex-wrap justify-between gap-x-4 py-3">
                      <span>Errores evitados</span>
                      <span className="font-semibold tabular-nums">34 /mes</span>
                    </div>
                  </div>

                  <div
                    className="px-4 sm:px-8 py-6 sm:py-10"
                    style={{ background: "rgba(11,138,94,0.07)" }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                      <div>
                        <p
                          className="font-mono text-[0.62rem] uppercase tracking-[0.18em] mb-2"
                          style={{ color: C.muted }}
                        >
                          Ahorro
                        </p>
                        <p
                          className="font-mono font-bold tracking-[-0.04em] leading-none"
                          style={{
                            color: C.emerald,
                            fontSize: "clamp(1.5rem, 5vw, 3rem)",
                          }}
                        >
                          S/ 65,232
                          <span className="text-xs sm:text-sm font-normal"> / año</span>
                        </p>
                      </div>
                      <div>
                        <p
                          className="font-mono text-[0.62rem] uppercase tracking-[0.18em] mb-2"
                          style={{ color: C.muted }}
                        >
                          Inversión año 1
                        </p>
                        <p
                          className="font-mono font-bold tracking-[-0.04em] leading-none"
                          style={{
                            color: C.ink,
                            fontSize: "clamp(1.5rem, 5vw, 3rem)",
                          }}
                        >
                          S/ 55,200
                        </p>
                      </div>
                      <div>
                        <p
                          className="font-mono text-[0.62rem] uppercase tracking-[0.18em] mb-2"
                          style={{ color: C.muted }}
                        >
                          Recuperación
                        </p>
                        <p
                          className="font-mono font-bold tracking-[-0.04em] leading-none"
                          style={{
                            color: C.emerald,
                            fontSize: "clamp(1.5rem, 5vw, 3rem)",
                          }}
                        >
                          10.2
                          <span className="text-xs sm:text-sm font-normal"> meses</span>
                        </p>
                      </div>
                      <div>
                        <p
                          className="font-mono text-[0.62rem] uppercase tracking-[0.18em] mb-2"
                          style={{ color: C.muted }}
                        >
                          Del año 2
                        </p>
                        <p
                          className="font-mono font-bold tracking-[-0.04em] leading-none"
                          style={{
                            color: C.ink,
                            fontSize: "clamp(1.5rem, 5vw, 3rem)",
                          }}
                        >
                          S/ 52,032
                          <span className="text-xs sm:text-sm font-normal"> / año</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p
                  className="mt-5 font-mono text-[0.62rem] tracking-wide"
                  style={{ color: C.muted }}
                >
                  Distribuidora mayorista · Lima · 58 empleados. Costo hora S/ 14,
                  calculado sobre sueldo de mercado más cargas sociales de ley.
                </p>

                <p
                  className="mt-8 font-serif text-xl sm:text-2xl font-medium"
                  style={{ color: C.emerald }}
                >
                  Si la cuenta no da, no le proponemos el proyecto.
                </p>
              </GlassPanel>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              6 — CÓMO SE EMPIEZA
          ═══════════════════════════════════════════════════ */}
          <section
            className="min-h-screen flex items-center justify-center px-4 sm:px-5 py-20 sm:py-28"
            style={{ background: "#000000" }}
          >
            <div className="max-w-5xl w-full">
              <GlassPanel className="p-5 sm:p-10 md:p-14">
                <SectionLabel>Cómo se empieza</SectionLabel>

                <h2
                  className="font-serif leading-[1.1] tracking-[-0.02em]"
                  style={{
                    color: C.ink,
                    fontSize: "clamp(1.5rem, 4vw, 3rem)",
                  }}
                >
                  Tres formas de trabajar juntos.
                </h2>
                <p
                  className="mt-4 text-base sm:text-lg"
                  style={{ color: C.muted }}
                >
                  Se puede parar después de la primera.
                </p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    {
                      t: "Radiografía",
                      k: "2 a 3 semanas",
                      d: "Entrevistamos a su equipo y observamos cómo trabaja la empresa de verdad. Le entregamos el mapa de procesos, el ranking de oportunidades con horas y costo mensual, y una recomendación por proceso. Si continúa, el costo se acredita.",
                    },
                    {
                      t: "Piloto medido",
                      k: "30 a 45 días",
                      d: "Un proceso. Un indicador acordado antes de empezar. Medición antes y después, e informe del resultado salga como salga. Se escala o se descarta con datos.",
                    },
                    {
                      t: "Implementación",
                      k: "según diagnóstico",
                      d: "Construcción, integración con los sistemas que ya usa, capacitación del equipo y soporte. Nada de migrar todo: se conecta con lo que hay.",
                    },
                  ].map((o, i) => (
                    <div
                      key={o.t}
                      className="p-5 sm:p-7 rounded-xl border flex flex-col"
                      style={{
                        borderColor: C.rule,
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <Mono
                        className="text-[0.62rem] tracking-[0.2em]"
                        style={{ color: C.emerald }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </Mono>
                      <p
                        className="mt-4 font-serif text-xl sm:text-3xl leading-tight"
                        style={{ color: C.ink }}
                      >
                        {o.t}
                      </p>
                      <Mono
                        className="mt-2 text-[0.62rem] uppercase tracking-[0.16em]"
                        style={{ color: C.emerald }}
                      >
                        {o.k}
                      </Mono>
                      <p
                        className="mt-5 text-sm leading-relaxed flex-1"
                        style={{ color: C.muted }}
                      >
                        {o.d}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-8 p-5 sm:p-8 rounded-xl"
                  style={{ background: "rgba(240,101,90,0.10)" }}
                >
                  <p
                    className="font-serif text-xl sm:text-3xl font-medium"
                    style={{ color: C.red }}
                  >
                    Qué no hacemos
                  </p>
                  <ul className="mt-6 space-y-4">
                    {[
                      "No vendemos licencias de terceros con sobreprecio.",
                      "No proponemos un proyecto cuyo retorno no podamos calcular.",
                      "No reemplazamos personas. Sacamos tareas.",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm sm:text-lg"
                        style={{ color: C.ink }}
                      >
                        <span
                          className="inline-block w-2 h-2 rounded-full mt-2 shrink-0"
                          style={{ background: C.red }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassPanel>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              7 — CONTRAPORTADA (dark)
          ═══════════════════════════════════════════════════ */}
          <section
            id="contacto"
            className="min-h-screen flex items-center justify-center px-4 sm:px-5 py-20 sm:py-28"
            style={{ background: "#000000" }}
          >
            <div className="max-w-4xl w-full">
              <SectionLabel color={C.darkMuted}>Contraportada</SectionLabel>

              <h2
                className="font-serif leading-[1.1] tracking-[-0.02em]"
                style={{
                  color: C.lightText,
                  fontSize: "clamp(1.5rem, 4vw, 3rem)",
                }}
              >
                Quiénes somos
              </h2>

              <p
                className="mt-8 text-base sm:text-lg leading-relaxed max-w-2xl"
                style={{ color: C.lightMuted2 }}
              >
                HyS Software Company es un equipo de desarrollo que construye, escala
                y mantiene software a medida. Llevamos{" "}
                <Mono className="font-semibold" style={{ color: C.lightText }}>
                  más de 150 proyectos
                </Mono>{" "}
                entregados y trabajamos con la arquitectura y las herramientas que
                cada problema pide, no con una plataforma que haya que vender.
              </p>
              <p
                className="mt-4 text-base sm:text-lg leading-relaxed max-w-2xl"
                style={{ color: C.lightMuted2 }}
              >
                La automatización de procesos es una extensión natural de eso: primero
                entender cómo opera un negocio, después decidir qué se construye.
              </p>

              <div
                className="mt-12 p-5 sm:p-9 rounded-xl border-2"
                style={{
                  borderColor: C.violet,
                  background: "rgba(52,21,92,0.4)",
                }}
              >
                <p
                  className="font-mono text-[0.62rem] uppercase tracking-[0.2em] mb-4"
                  style={{ color: C.violet }}
                >
                  La regla de la casa
                </p>
                <p
                  className="font-serif text-lg sm:text-2xl font-medium leading-snug"
                  style={{ color: "#D4B5F7" }}
                >
                  Si el diagnóstico concluye que no le conviene automatizar, se lo
                  decimos y no le vendemos la implementación. Está por escrito en
                  nuestra propuesta.
                </p>
              </div>

              <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                <div>
                  <p
                    className="font-mono text-[0.62rem] uppercase tracking-[0.2em] mb-5"
                    style={{ color: C.emerald }}
                  >
                    Contacto
                  </p>
                  <p
                    className="font-serif text-xl"
                    style={{ color: C.lightText }}
                  >
                    Samuel Mauricio Laime
                  </p>
                  <a
                    href="mailto:samuelmauriciolaime@gmail.com"
                    className="mt-3 text-sm border-b transition-opacity hover:opacity-70 min-h-[44px] flex items-center"
                    style={{ color: C.lightMuted2, borderColor: C.ink2 }}
                  >
                    samuelmauriciolaime@gmail.com
                  </a>
                  <a
                    href="https://wa.me/51914895330"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-sm border-b transition-opacity hover:opacity-70 min-h-[44px] flex items-center"
                    style={{ color: C.lightMuted2, borderColor: C.ink2 }}
                  >
                    +51 914 895 330
                  </a>
                </div>
                <div className="flex flex-col items-start sm:items-end justify-end gap-4">
                  <a
                    href="https://hysdevs.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm border-b transition-opacity hover:opacity-70 min-h-[44px] flex items-center"
                    style={{ color: C.lightMuted, borderColor: C.ink2 }}
                  >
                    hysdevs.com
                  </a>
                  <p
                    className="text-[0.62rem] font-mono tracking-wide"
                    style={{ color: C.darkMuted }}
                  >
                    Automatización de procesos con criterio · Lima, Perú
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
