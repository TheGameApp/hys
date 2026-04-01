"use client";

import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function Pricing() {
  const t = useTranslations("pricing");

  const plans = [
    {
      name: t("ticket_name"),
      description: t("ticket_desc"),
      price: 0,
      originalPrice: null,
      suffix: "",
      features: [
        t("ticket_f1"),
        t("ticket_f2"),
        t("ticket_f3"),
        t("ticket_f4"),
      ],
      cta: t("ticket_cta"),
      variant: "outline" as const,
      popular: false,
      note: null,
    },
    {
      name: t("consulting_name"),
      description: t("consulting_desc"),
      price: 150,
      originalPrice: null,
      suffix: t("per_session"),
      features: [
        t("consulting_f1"),
        t("consulting_f2"),
        t("consulting_f3"),
        t("consulting_f4"),
        t("consulting_f5"),
      ],
      cta: t("consulting_cta"),
      variant: "default" as const,
      popular: true,
      note: t("consulting_note"),
    },
    {
      name: t("development_name"),
      description: t("development_desc"),
      price: null,
      originalPrice: null,
      suffix: "",
      features: [
        t("development_f1"),
        t("development_f2"),
        t("development_f3"),
        t("development_f4"),
        t("development_f5"),
        t("development_f6"),
        t("development_f7"),
      ],
      cta: t("development_cta"),
      variant: "outline" as const,
      popular: false,
      note: t("development_note"),
    },
  ];

  return (
    <SectionWrapper id="precios">
      <div className="text-center mb-16">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
          {t("label")}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          {t("title")}{" "}
          <span className="font-serif italic">{t("title_accent")}</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          {t("subtitle")}
        </p>
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
            <Card
              className={`relative h-full flex flex-col ${plan.popular ? "border-foreground shadow-lg shadow-foreground/5" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background">
                  {t("recommended")}
                </Badge>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.description}
                </p>
              </div>
              <div className="mb-6">
                {plan.price !== null ? (
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    {plan.suffix && (
                      <span className="text-muted-foreground mb-1">
                        {plan.suffix}
                      </span>
                    )}
                    {plan.price === 0 && (
                      <span className="text-muted-foreground mb-1">
                        {t("free")}
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="text-lg text-muted-foreground line-through">
                      {t("consulting_discount")}
                    </span>
                    <span className="text-4xl font-bold ml-2">Custom</span>
                  </div>
                )}
              </div>
              {plan.note && (
                <p className="text-xs text-primary font-medium mb-4 -mt-2">
                  {plan.note}
                </p>
              )}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-foreground flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.variant}
                className="w-full"
                onClick={() =>
                  document
                    .getElementById("contacto")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {plan.cta}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
