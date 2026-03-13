"use client";

import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Globe, Building2, Lightbulb, BrainCircuit } from "lucide-react";

export function Features() {
  const t = useTranslations("features");

  const features = [
    {
      number: "01",
      title: t("web_title"),
      description: t("web_desc"),
      icon: Globe,
    },
    {
      number: "02",
      title: t("software_title"),
      description: t("software_desc"),
      icon: Building2,
    },
    {
      number: "03",
      title: t("consulting_title"),
      description: t("consulting_desc"),
      icon: Lightbulb,
    },
    {
      number: "04",
      title: t("ai_title"),
      description: t("ai_desc"),
      icon: BrainCircuit,
    },
  ];

  return (
    <SectionWrapper id="servicios">
      <div className="text-center mb-16">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
          {t("label")}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          {t("title")} <span className="font-serif italic">{t("title_accent")}</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Card className="group hover:border-primary/50 transition-colors h-full">
              <div className="flex items-start gap-4">
                <span className="text-4xl font-bold text-muted-foreground/30 font-mono">
                  {feature.number}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <feature.icon className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
