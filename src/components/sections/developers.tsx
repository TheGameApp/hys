"use client";

import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { motion } from "framer-motion";
import { Terminal, Zap, Globe } from "lucide-react";

const installCode = `# npm
npm install @hys/sdk

# yarn
yarn add @hys/sdk

# pnpm
pnpm add @hys/sdk`;

export function Developers() {
  const t = useTranslations("developers");

  const highlights = [
    { icon: Terminal, label: t("ts_native") },
    { icon: Zap, label: t("zero_config") },
    { icon: Globe, label: t("edge_ready") },
  ];

  return (
    <SectionWrapper>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
            {t("label")}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            {t("title")} <span className="font-serif italic">{t("title_accent")}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {t("description")}
          </p>
          <div className="flex flex-wrap gap-3">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="flex items-center gap-2 px-4 py-2">
                  <h.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{h.label}</span>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <CodeBlock code={installCode} language="bash" />
        </div>
      </div>
    </SectionWrapper>
  );
}
