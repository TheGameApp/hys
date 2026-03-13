"use client";

import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Target,
  Handshake,
  Shield,
  Search,
  PenTool,
  Code2,
  Rocket,
} from "lucide-react";

const values = [
  { key: "innovation", icon: Lightbulb },
  { key: "excellence", icon: Target },
  { key: "commitment", icon: Handshake },
  { key: "transparency", icon: Shield },
];

const processSteps = [
  { key: "step1", icon: Search },
  { key: "step2", icon: PenTool },
  { key: "step3", icon: Code2 },
  { key: "step4", icon: Rocket },
];

export default function NosotrosPage() {
  const t = useTranslations("about");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        {/* Hero */}
        <section className="py-20 px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-medium text-primary tracking-wider uppercase">
                {t("label")}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mt-4 tracking-tight">
                {t("hero_title")}{" "}
                <span className="text-primary">{t("hero_title_accent")}</span>
              </h1>
              <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
                {t("hero_subtitle")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 px-6 md:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6">{t("story_title")}</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t("story_p1")}</p>
                <p>{t("story_p2")}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold">
                {t("team_title")} <span className="text-primary">{t("team_title_accent")}</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {(["member1", "member2"] as const).map((member, i) => (
                <motion.div
                  key={member}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  <Card className="p-8 text-center h-full">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                      <span className="text-primary font-bold text-xl">
                        {t(`${member}_initials`)}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg">{t(`${member}_name`)}</h3>
                    <p className="text-sm text-primary font-medium mt-1">{t(`${member}_role`)}</p>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      {t(`${member}_desc`)}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-6 md:px-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold">
                {t("values_title")} <span className="text-primary">{t("values_title_accent")}</span>
              </h2>
            </div>
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
                    <value.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{t(`value_${value.key}_title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`value_${value.key}_desc`)}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 px-6 md:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold">
                {t("process_title")} <span className="text-primary">{t("process_title_accent")}</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, i) => (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Card className="p-6 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {i + 1}
                      </span>
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{t(`process_${step.key}_title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`process_${step.key}_desc`)}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
