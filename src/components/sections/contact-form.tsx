"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle, AlertCircle, Ticket } from "lucide-react";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [ticketId, setTicketId] = useState("HYS-0000");

  useEffect(() => {
    setTicketId(`HYS-${String(Math.floor(Math.random() * 9000) + 1000)}`);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      project_type: formData.get("project_type") as string,
      budget: formData.get("budget") as string,
      priority: formData.get("priority") as string,
      message: formData.get("message") as string,
      website: formData.get("website") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Error");
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  const selectClass = "flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20";

  return (
    <SectionWrapper id="contacto">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-foreground uppercase tracking-widest mb-3">
            {t("label")}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            {t("title")} <span className="font-serif italic">{t("title_accent")}</span>
          </h2>
          <p className="text-muted-foreground mt-4">{t("subtitle")}</p>
        </div>

        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          {/* Ticket header bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-muted border-b border-border">
            <div className="flex items-center gap-3">
              <Ticket className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono text-muted-foreground">
                {t("ticket_id")} {ticketId}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 [data-theme=dark]:bg-emerald-900/30 [data-theme=dark]:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t("status")}
            </span>
          </div>

          {status === "success" ? (
            <div className="text-center py-12 px-6">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("success_title")}</h3>
              <p className="text-muted-foreground">{t("success_msg")}</p>
              <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
                {t("success_cta")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="ct-name" className="block text-sm font-medium mb-1.5">{t("name")} *</label>
                  <Input id="ct-name" name="name" placeholder={t("name_placeholder")} required />
                </div>
                <div>
                  <label htmlFor="ct-email" className="block text-sm font-medium mb-1.5">{t("email")} *</label>
                  <Input id="ct-email" name="email" type="email" placeholder={t("email_placeholder")} required />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="ct-company" className="block text-sm font-medium mb-1.5">{t("company")}</label>
                  <Input id="ct-company" name="company" placeholder={t("company_placeholder")} />
                </div>
                <div>
                  <label htmlFor="ct-type" className="block text-sm font-medium mb-1.5">{t("project_type")}</label>
                  <select id="ct-type" name="project_type" className={selectClass}>
                    <option value="web">{t("type_web")}</option>
                    <option value="software">{t("type_software")}</option>
                    <option value="consulting">{t("type_consulting")}</option>
                    <option value="ai">{t("type_ai")}</option>
                    <option value="other">{t("type_other")}</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="ct-budget" className="block text-sm font-medium mb-1.5">{t("budget")}</label>
                  <select id="ct-budget" name="budget" className={selectClass}>
                    <option value="$1k-$5k">{t("budget_1")}</option>
                    <option value="$5k-$15k">{t("budget_2")}</option>
                    <option value="$15k-$50k">{t("budget_3")}</option>
                    <option value="$50k+">{t("budget_4")}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ct-priority" className="block text-sm font-medium mb-1.5">{t("priority")}</label>
                  <select id="ct-priority" name="priority" className={selectClass} defaultValue="medium">
                    <option value="low">{t("priority_low")}</option>
                    <option value="medium">{t("priority_medium")}</option>
                    <option value="high">{t("priority_high")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="ct-message" className="block text-sm font-medium mb-1.5">{t("message")} *</label>
                <textarea
                  id="ct-message"
                  name="message"
                  rows={4}
                  required
                  placeholder={t("message_placeholder")}
                  className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 resize-none"
                />
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" /> {errorMsg}
                </div>
              )}

              <Button type="submit" className="w-full gap-2" disabled={status === "loading"}>
                {status === "loading" ? t("submitting") : <>{t("submit")} <Send className="h-4 w-4" /></>}
              </Button>
            </form>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
