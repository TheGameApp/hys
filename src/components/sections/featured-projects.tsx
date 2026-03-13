"use client";

import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const projects = [
  { key: "fintrack", techs: ["React", "Node.js", "PostgreSQL"] },
  { key: "logichain", techs: ["Next.js", "Python", "AWS"] },
  { key: "mediconnect", techs: ["React Native", "GraphQL"] },
  { key: "eduplatform", techs: ["Next.js", "Supabase", "Stripe"] },
  { key: "retailmax", techs: ["Next.js", "Shopify", "Redis"] },
  { key: "dataflow", techs: ["Python", "D3.js", "BigQuery"] },
];

export function FeaturedProjects() {
  const t = useTranslations("featured_projects");

  return (
    <SectionWrapper id="proyectos-destacados">
      <div className="text-center mb-16">
        <span className="text-sm font-medium text-primary tracking-wider uppercase">
          {t("label")}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-3">
          {t("title")} <span className="text-primary">{t("title_accent")}</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <Card className="p-6 h-full flex flex-col">
              <Badge variant="secondary" className="w-fit mb-3 text-xs">
                {t(`${project.key}_category`)}
              </Badge>
              <h3 className="font-semibold text-lg mb-2">{t(`${project.key}_title`)}</h3>
              <p className="text-sm text-muted-foreground flex-1 mb-4">
                {t(`${project.key}_desc`)}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.techs.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
