"use client";

import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { CodeBlock } from "@/components/ui/code-block";
import { motion } from "framer-motion";
import { Search, PenTool, Code2, Rocket } from "lucide-react";

const codeSnippet = `import { hys } from '@hys/software'

const project = await hys.create({
  client: 'tu-empresa',
  stack: ['React', 'Node.js', 'PostgreSQL'],
  methodology: 'agile'
})

await project.deploy({ environment: 'production' })`;

export function Process() {
  const t = useTranslations("process");

  const steps = [
    {
      icon: Search,
      title: t("step1_title"),
      description: t("step1_desc"),
    },
    {
      icon: PenTool,
      title: t("step2_title"),
      description: t("step2_desc"),
    },
    {
      icon: Code2,
      title: t("step3_title"),
      description: t("step3_desc"),
    },
    {
      icon: Rocket,
      title: t("step4_title"),
      description: t("step4_desc"),
    },
  ];

  return (
    <SectionWrapper id="proceso">
      <div className="text-center mb-16">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
          {t("label")}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          {t("title")} <span className="font-serif italic">{t("title_accent")}</span>
        </h2>
      </div>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="flex gap-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <div>
          <CodeBlock code={codeSnippet} />
        </div>
      </div>
    </SectionWrapper>
  );
}
