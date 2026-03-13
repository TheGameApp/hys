"use client";

import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const technologies = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Vue.js", category: "Frontend" },
  { name: "Angular", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "Go", category: "Backend" },
  { name: "AWS", category: "Cloud" },
  { name: "GCP", category: "Cloud" },
  { name: "Azure", category: "Cloud" },
  { name: "Docker", category: "DevOps" },
  { name: "Kubernetes", category: "DevOps" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "Redis", category: "Database" },
  { name: "GraphQL", category: "API" },
  { name: "Figma", category: "Design" },
  { name: "GitHub", category: "DevOps" },
  { name: "Stripe", category: "Payments" },
  { name: "Terraform", category: "Infrastructure" },
  { name: "Supabase", category: "Backend" },
  { name: "Tailwind", category: "Frontend" },
  { name: "Prisma", category: "Database" },
];

export function Integrations() {
  const t = useTranslations("integrations");

  return (
    <SectionWrapper id="tecnologias">
      <div className="text-center mb-16">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
          {t("label")}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          {t("title")}{" "}
          <span className="font-serif italic">{t("title_accent")}</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {technologies.map((tech, i) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.3,
              delay: i * 0.03,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Card className="text-center p-4 hover:border-primary/50 transition-colors group cursor-default">
              <p className="text-sm font-medium group-hover:text-primary transition-colors">
                {tech.name}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
                {tech.category}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
