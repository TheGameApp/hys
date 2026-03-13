"use client";

import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Code2, Users, FolderGit2, Globe } from "lucide-react";

export function Metrics() {
  const t = useTranslations("metrics");

  const metrics = [
    {
      icon: FolderGit2,
      value: 150,
      suffix: "+",
      label: t("projects"),
    },
    {
      icon: Code2,
      value: 2,
      suffix: "M+",
      label: t("code"),
    },
    {
      icon: Users,
      value: 80,
      suffix: "+",
      label: t("clients"),
    },
    {
      icon: Globe,
      value: 12,
      suffix: "",
      label: t("countries"),
    },
  ];

  return (
    <SectionWrapper>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label} className="text-center">
            <metric.icon className="h-6 w-6 text-primary mx-auto mb-3" />
            <div className="text-3xl md:text-4xl font-bold">
              <AnimatedCounter end={metric.value} suffix={metric.suffix} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{metric.label}</p>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
