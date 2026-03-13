"use client";

import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileCheck } from "lucide-react";

const certifications = ["SOC 2 Type II", "ISO 27001", "GDPR"];

export function Security() {
  const t = useTranslations("security");

  const features = [
    { icon: Lock, title: t("encryption_title"), description: t("encryption_desc") },
    { icon: Shield, title: t("zerotrust_title"), description: t("zerotrust_desc") },
    { icon: Eye, title: t("monitoring_title"), description: t("monitoring_desc") },
    { icon: FileCheck, title: t("audit_title"), description: t("audit_desc") },
  ];

  return (
    <SectionWrapper>
      <div className="text-center mb-16">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
          {t("label")}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          {t("title")} <span className="font-serif italic">{t("title_accent")}</span>
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {certifications.map((cert) => (
          <Badge key={cert} variant="default" className="px-4 py-2 text-sm">
            <Shield className="h-3 w-3 mr-2" />
            {cert}
          </Badge>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Card className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
