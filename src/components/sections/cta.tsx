"use client";

import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";

export function CTA() {
  const t = useTranslations("cta");

  return (
    <SectionWrapper>
      <div className="text-center rounded-3xl border border-border bg-muted/30 p-12 md:p-20">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {t("title_1")} <span className="font-serif italic">{t("title_accent")}</span> {t("title_2")}
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
          {t("subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#contacto">
            <Button size="lg" className="gap-2">
              {t("primary")} <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
          <a href="#contacto">
            <Button variant="outline" size="lg" className="gap-2">
              <MessageSquare className="h-4 w-4" /> {t("secondary")}
            </Button>
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
