"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { OtpInput } from "@/components/mfa/otp-input";
import { QrCode } from "@/components/mfa/qr-code";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Loader2,
  Shield,
  ShieldCheck,
  X,
} from "lucide-react";

interface SecurityPanelProps {
  hasTotp: boolean;
  isAdmin: boolean;
  showForceBanner: boolean;
}

type Mode = "idle" | "enrolling" | "disabling";

interface EnrollData {
  factorId: string;
  secret: string;
  qrCodeDataUrl: string;
}

export function SecurityPanel({
  hasTotp: initialHasTotp,
  isAdmin,
  showForceBanner,
}: SecurityPanelProps) {
  const t = useTranslations("mfa");
  const router = useRouter();
  const [hasTotp, setHasTotp] = useState(initialHasTotp);
  const [mode, setMode] = useState<Mode>("idle");
  const [enrollData, setEnrollData] = useState<EnrollData | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function startEnroll() {
    setError("");
    setGlobalError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/mfa/totp/enroll", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "enroll_failed");
      setEnrollData(data);
      setMode("enrolling");
      setCode("");
    } catch (e) {
      setGlobalError(e instanceof Error ? e.message : "enroll_failed");
    } finally {
      setLoading(false);
    }
  }

  async function confirmEnroll() {
    if (!enrollData) return;
    if (code.length !== 6) {
      setError(t("code_required"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/mfa/totp/verify-enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ factorId: enrollData.factorId, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "verify_failed");
      setHasTotp(true);
      setMode("idle");
      setEnrollData(null);
      setCode("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "verify_failed");
    } finally {
      setLoading(false);
    }
  }

  function cancelEnroll() {
    setMode("idle");
    setEnrollData(null);
    setCode("");
    setError("");
  }

  async function confirmDisable() {
    if (!password) {
      setError(t("password_required"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/mfa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "disable_failed");

      // Server already invalidated the session globally. Clear local Supabase
      // client state and bounce to login so the user starts a fresh session.
      const supabase = createClient();
      await supabase.auth.signOut().catch(() => {});
      router.replace("/auth/login?mfa_disabled=1");
    } catch (e) {
      setError(e instanceof Error ? e.message : "disable_failed");
      setLoading(false);
    }
  }

  async function copySecret() {
    if (!enrollData) return;
    await navigator.clipboard.writeText(enrollData.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      {showForceBanner && !hasTotp && isAdmin && (
        <div className="flex gap-3 items-start rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
          <p className="text-red-500">{t("admin_must_enable_2fa")}</p>
        </div>
      )}

      {globalError && (
        <div className="flex gap-3 items-start rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
          <p className="text-red-500">{globalError}</p>
        </div>
      )}

      <Card>
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-2.5">
            {hasTotp ? (
              <ShieldCheck className="h-5 w-5 text-primary" />
            ) : (
              <Shield className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{t("totp_title")}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {hasTotp ? t("totp_active_desc") : t("totp_inactive_desc")}
            </p>
            <div className="mt-3 flex items-center gap-2">
              {hasTotp ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  {t("status_active")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  {t("status_inactive")}
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0">
            {hasTotp ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMode("disabling");
                  setError("");
                }}
                disabled={loading || mode !== "idle"}
              >
                {t("disable_2fa")}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={startEnroll}
                disabled={loading || mode !== "idle"}
              >
                {loading && mode === "idle" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("enable_2fa")
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {mode === "enrolling" && enrollData && (
        <Card>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-semibold">{t("setup_title")}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("scan_qr_instruction")}
              </p>
            </div>
            <button
              onClick={cancelEnroll}
              className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-4 py-2">
            <QrCode dataUrl={enrollData.qrCodeDataUrl} />

            <div className="w-full text-center">
              <p className="text-xs text-muted-foreground mb-1.5">
                {t("manual_secret")}
              </p>
              <button
                onClick={copySecret}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm font-mono hover:bg-accent transition-colors cursor-pointer"
              >
                {enrollData.secret}
                <Copy className="h-3.5 w-3.5" />
                {copied && <span className="text-xs text-green-600">✓</span>}
              </button>
            </div>

            <div className="w-full pt-2">
              <p className="text-sm font-medium text-center mb-3">
                {t("enter_code_instruction")}
              </p>
              <OtpInput value={code} onChange={setCode} autoFocus />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}

            <div className="flex gap-2 w-full justify-end pt-2">
              <Button variant="outline" size="sm" onClick={cancelEnroll}>
                {t("cancel")}
              </Button>
              <Button size="sm" onClick={confirmEnroll} disabled={loading || code.length !== 6}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("verify_and_activate")}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {mode === "disabling" && (
        <Card>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-semibold">{t("disable_title")}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("disable_warning")}
              </p>
            </div>
            <button
              onClick={() => {
                setMode("idle");
                setPassword("");
                setError("");
              }}
              className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                {t("confirm_password")}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}

            <div className="flex gap-2 justify-end pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMode("idle");
                  setPassword("");
                  setError("");
                }}
              >
                {t("cancel")}
              </Button>
              <Button size="sm" onClick={confirmDisable} disabled={loading || !password}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("disable_2fa")}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
