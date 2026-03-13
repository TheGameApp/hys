"use client";

import { useTranslations } from "next-intl";
import { Marquee } from "@/components/ui/marquee";

export function Ribbon() {
  const t = useTranslations("ribbon");

  const metrics = [
    { value: "3x", label: t("m1_label"), company: "FINANCEAPP" },
    { value: "60%", label: t("m2_label"), company: "HEALTHTECH" },
    { value: "99.9%", label: t("m3_label"), company: "RETAILMAX" },
    { value: "150+", label: t("m4_label"), company: "HYS" },
    { value: "20 días", label: t("m5_label"), company: "LOGITECH" },
    { value: "98%", label: t("m6_label"), company: "SCALEUP LABS" },
    { value: "300%", label: t("m7_label"), company: "DATAFLOW" },
    { value: "50+", label: t("m8_label"), company: "HYS" },
  ];

  return (
    <section className="py-6 border-y border-border overflow-hidden">
      <Marquee speed={35}>
        <div className="flex items-center gap-10 md:gap-16 px-4 md:px-8">
          {metrics.map((metric, i) => (
            <div key={i} className="flex items-baseline gap-2 md:gap-3 whitespace-nowrap">
              <span className="text-xl md:text-3xl font-bold tracking-tight">
                {metric.value}
              </span>
              <div className="flex flex-col">
                <span className="text-xs md:text-sm text-muted-foreground leading-tight">
                  {metric.label}
                </span>
                <span className="text-[10px] font-medium tracking-widest text-muted-foreground/60 uppercase">
                  {metric.company}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  );
}
