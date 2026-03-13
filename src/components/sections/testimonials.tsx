"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const trustedCompanies = [
  "FinTrack Pro", "LogiChain", "MediConnect", "ShopStream",
  "TeamSync", "GovPortal", "DataFlow", "ScaleUp Labs",
];

export function Testimonials() {
  const t = useTranslations("testimonials");
  const [current, setCurrent] = useState(0);

  const testimonials = [
    { quote: t("t1_quote"), name: t("t1_name"), role: t("t1_role"), result: t("t1_result") },
    { quote: t("t2_quote"), name: t("t2_name"), role: t("t2_role"), result: t("t2_result") },
    { quote: t("t3_quote"), name: t("t3_name"), role: t("t3_role"), result: t("t3_result") },
  ];

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

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

      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 md:p-12">
              <Quote className="h-8 w-8 text-muted-foreground/20 mb-4" />
              <p className="text-lg md:text-xl leading-relaxed mb-6">
                &ldquo;{testimonials[current].quote}&rdquo;
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{testimonials[current].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
                </div>
                <span className="text-xs font-mono bg-muted px-3 py-1 rounded-full">
                  {testimonials[current].result}
                </span>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6">
          <span className="text-sm text-muted-foreground font-mono">
            {String(current + 1).padStart(2, "0")}/{String(testimonials.length).padStart(2, "0")}
          </span>
          <div className="flex gap-2">
            <button onClick={prev} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={next} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-12 border-t border-border">
        <p className="text-center text-sm text-muted-foreground mb-8">{t("trusted")}</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {trustedCompanies.map((company) => (
            <span key={company} className="text-sm font-medium text-muted-foreground/50 hover:text-muted-foreground transition-colors">
              {company}
            </span>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
