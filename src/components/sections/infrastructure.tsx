"use client";

import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { motion } from "framer-motion";
import { Globe, Server, Zap } from "lucide-react";

const cities = [
  { name: "Ciudad de México", latency: "12ms" },
  { name: "São Paulo", latency: "18ms" },
  { name: "Madrid", latency: "24ms" },
  { name: "New York", latency: "8ms" },
  { name: "London", latency: "22ms" },
  { name: "Tokyo", latency: "45ms" },
];

export function Infrastructure() {
  const t = useTranslations("infrastructure");

  return (
    <SectionWrapper>
      <div className="text-center mb-16">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
          {t("label")}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          {t("title")}{" "}
          <span className="font-serif italic">{t("title_accent")}</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center">
          <Server className="h-8 w-8 text-primary mx-auto mb-3" />
          <div className="text-3xl font-bold">
            <AnimatedCounter end={24} suffix="+" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{t("servers")}</p>
        </Card>
        <Card className="text-center">
          <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
          <div className="text-3xl font-bold">
            <AnimatedCounter end={99} suffix=".99%" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{t("uptime")}</p>
        </Card>
        <Card className="text-center">
          <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
          <div className="text-3xl font-bold">
            {"<"}<AnimatedCounter end={50} suffix="ms" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{t("latency")}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-border">
          {cities.map((city, i) => (
            <motion.div
              key={city.name}
              className="p-4 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-sm font-medium">{city.name}</p>
              <p className="text-xs text-emerald-500 font-mono mt-1">{city.latency}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </SectionWrapper>
  );
}
