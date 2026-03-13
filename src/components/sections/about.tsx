"use client";

import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Lightbulb, Target, Handshake, Shield } from "lucide-react";

const values = [
  { key: "innovation", icon: Lightbulb },
  { key: "excellence", icon: Target },
  { key: "commitment", icon: Handshake },
  { key: "transparency", icon: Shield },
];

export function About() {
  const t = useTranslations("about");

  return (
    <SectionWrapper id="nosotros">
      <div className="text-center mb-16">
        <span className="text-sm font-medium text-primary tracking-wider uppercase">
          {t("label")}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-3">
          {t("title")} <span className="text-primary">{t("title_accent")}</span>
        </h2>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto mb-16">
        <p className="text-muted-foreground text-center leading-relaxed">
          {t("story")}
        </p>
      </div>

      {/* Team */}
      <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-2xl mx-auto">
        {(["member1", "member2"] as const).map((member, i) => (
          <motion.div
            key={member}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            <Card className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-lg">
                  {t(`${member}_initials`)}
                </span>
              </div>
              <h3 className="font-semibold text-lg">{t(`${member}_name`)}</h3>
              <p className="text-sm text-primary font-medium">{t(`${member}_role`)}</p>
              <p className="text-sm text-muted-foreground mt-2">{t(`${member}_desc`)}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Values */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((value, i) => (
          <motion.div
            key={value.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Card className="p-6 text-center h-full">
              <value.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t(`value_${value.key}_title`)}</h3>
              <p className="text-sm text-muted-foreground">{t(`value_${value.key}_desc`)}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
