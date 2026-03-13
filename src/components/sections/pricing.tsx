"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function Pricing() {
  const t = useTranslations("pricing");
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: t("starter_name"),
      description: t("starter_desc"),
      monthly: 0,
      annual: 0,
      features: [t("starter_f1"), t("starter_f2"), t("starter_f3"), t("starter_f4")],
      cta: t("starter_cta"),
      variant: "outline" as const,
      popular: false,
    },
    {
      name: t("pro_name"),
      description: t("pro_desc"),
      monthly: 49,
      annual: 41,
      features: [t("pro_f1"), t("pro_f2"), t("pro_f3"), t("pro_f4"), t("pro_f5"), t("pro_f6")],
      cta: t("pro_cta"),
      variant: "default" as const,
      popular: true,
    },
    {
      name: t("enterprise_name"),
      description: t("enterprise_desc"),
      monthly: null,
      annual: null,
      features: [t("enterprise_f1"), t("enterprise_f2"), t("enterprise_f3"), t("enterprise_f4"), t("enterprise_f5"), t("enterprise_f6"), t("enterprise_f7")],
      cta: t("enterprise_cta"),
      variant: "outline" as const,
      popular: false,
    },
  ];

  return (
    <SectionWrapper id="precios">
      <div className="text-center mb-16">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
          {t("label")}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          {t("title")} <span className="font-serif italic">{t("title_accent")}</span>
        </h2>
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-sm ${!annual ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            {t("monthly")}
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${annual ? "bg-foreground" : "bg-muted"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform ${annual ? "translate-x-6" : ""}`} />
          </button>
          <span className={`text-sm ${annual ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            {t("annual")}
          </span>
          {annual && <Badge variant="success" className="ml-1">{t("save")}</Badge>}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Card className={`relative h-full flex flex-col ${plan.popular ? "border-foreground shadow-lg shadow-foreground/5" : ""}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background">
                  {t("pro_popular")}
                </Badge>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>
              <div className="mb-6">
                {plan.monthly !== null ? (
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold">${annual ? plan.annual : plan.monthly}</span>
                    {plan.monthly > 0 && <span className="text-muted-foreground mb-1">{t("per_month")}</span>}
                  </div>
                ) : (
                  <span className="text-4xl font-bold">Custom</span>
                )}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-foreground flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant={plan.variant} className="w-full">{plan.cta}</Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
