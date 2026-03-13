"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ArrowRight, Play } from "lucide-react";

const HeroScene = dynamic(
  () => import("@/components/three/hero-scene").then((mod) => ({ default: mod.HeroScene })),
  { ssr: false, loading: () => null }
);

export function Hero() {
  const t = useTranslations("hero");

  const stats = [
    { value: 50, suffix: "+", label: t("stat_projects") },
    { value: 98, suffix: "%", label: t("stat_satisfaction") },
    { value: 8, suffix: "+", label: t("stat_experience") },
    { value: 3, suffix: "x", label: t("stat_faster") },
  ];

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] md:min-h-screen flex items-center justify-center overflow-hidden">
      <HeroScene />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-20 pb-10 md:pt-24 md:pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {t("badge")}
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("title_1")}{" "}
          <span className="font-serif italic">{t("title_2")}</span>{" "}
          {t("title_3")}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <a href="#contacto">
            <Button size="lg" className="gap-2">
              {t("cta_primary")} <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
          <a href="#servicios">
            <Button variant="outline" size="lg" className="gap-2">
              <Play className="h-4 w-4" /> {t("cta_secondary")}
            </Button>
          </a>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-12 md:mt-20 pt-8 md:pt-10 border-t border-border"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
