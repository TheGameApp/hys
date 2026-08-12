"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Spline from "@splinetool/react-spline";
import type { Application, SPEObject, SplineEventName } from "@splinetool/runtime";

const SCENE_URL = "https://prod.spline.design/vCC9JoxmIUuCrcSJ/scene.splinecode";
const FLIP_AXIS: "x" | "y" | "z" = "z";

type FlipEvent = { name: SplineEventName; uuid: string } | null;

function findFlipEvent(spline: Application): FlipEvent {
  try {
    const events = (spline.getSplineEvents?.() ??
      {}) as Record<string, Record<string, unknown>>;
    for (const [evName, objs] of Object.entries(events)) {
      const uuids = Object.keys(objs ?? {});
      console.log(
        `[SplineHourglass] evento "${evName}" en ${uuids.length} objeto(s):`,
        uuids.join(", ")
      );
    }
    const keyEv = Object.keys(events).find((n) => /key|press/i.test(n));
    if (keyEv) {
      const uuids = Object.keys(events[keyEv] ?? {});
      if (uuids.length > 0) {
        return { name: keyEv as SplineEventName, uuid: uuids[0] };
      }
    }
  } catch (e) {
    console.warn("[SplineHourglass] no pude leer los eventos", e);
  }
  return null;
}

function findHourglassTarget(spline: Application): SPEObject | null {
  try {
    const all = spline.getAllObjects() ?? [];
    const preferred = all.filter((o) =>
      /hour|glass|sand|reloj|arena|liquid|time|group/i.test(o.name)
    );
    return preferred[0] ?? null;
  } catch {
    return null;
  }
}

export default function SplineHourglass({
  progressRef,
  totalSections = 5,
}: {
  progressRef: RefObject<{ current: number }>;
  totalSections?: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<Application | null>(null);
  const targetRef = useRef<SPEObject | null>(null);
  const flipRef = useRef<FlipEvent>(null);
  const lastSectionRef = useRef(-1);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const p = progressRef.current.current;
      const section = Math.min(
        Math.floor(p * totalSections),
        totalSections - 1
      );

      if (flipRef.current) {
        if (section !== lastSectionRef.current) {
          if (lastSectionRef.current >= 0) {
            if (section > lastSectionRef.current) {
              splineRef.current?.emitEvent(
                flipRef.current.name,
                flipRef.current.uuid
              );
            } else {
              splineRef.current?.emitEventReverse(
                flipRef.current.name,
                flipRef.current.uuid
              );
            }
            console.log(
              `[SplineHourglass] seccion ${lastSectionRef.current} -> ${section} (${
                section > lastSectionRef.current ? "volteo" : "reverso"
              })`
            );
          }
          lastSectionRef.current = section;
        }
      } else {
        const r = p * Math.PI;
        const target = targetRef.current;
        if (target) {
          target.rotation.x = FLIP_AXIS === "x" ? r : 0;
          target.rotation.y = FLIP_AXIS === "y" ? r : 0;
          target.rotation.z = FLIP_AXIS === "z" ? r : 0;
        } else if (wrapperRef.current) {
          wrapperRef.current.style.transform = `rotate(${p * 180}deg)`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [progressRef, totalSections]);

  const onLoad = (spline: Application) => {
    splineRef.current = spline;
    flipRef.current = findFlipEvent(spline);
    console.log(
      "[SplineHourglass] evento de volteo:",
      flipRef.current
        ? `${flipRef.current.name} @ ${flipRef.current.uuid}`
        : "(ninguno -> fallback rotacion)"
    );
    targetRef.current = findHourglassTarget(spline);
  };

  return (
    <div ref={wrapperRef} className="w-full h-[50vh] sm:h-[55vh] lg:h-[60vh]">
      <Spline scene={SCENE_URL} onLoad={onLoad} />
    </div>
  );
}
