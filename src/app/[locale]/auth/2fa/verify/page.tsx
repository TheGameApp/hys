"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OtpInput } from "@/components/mfa/otp-input";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";

const LOCALES = ["es", "en"];

function stripLocale(path: string): string {
  const segments = path.split("/").filter(Boolean);
  if (segments[0] && LOCALES.includes(segments[0])) {
    return "/" + segments.slice(1).join("/");
  }
  return path;
}

function VerifyForm() {
  const t = useTranslations("mfa");
  const router = useRouter();
  const searchParams = useSearchParams();
  // The next-intl router auto-prepends the locale, so we strip any leading
  // locale segment to avoid /es/es/... 404s when the middleware-set `next`
  // happens to already include the locale.
  const next = stripLocale(searchParams.get("next") ?? "/dashboard");

  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootError, setBootError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (cancelled) return;
      if (error) {
        setBootError(error.message);
        return;
      }
      const verified = (data?.totp ?? []).find((f) => f.status === "verified");
      if (!verified) {
        setBootError(t("no_factor"));
        return;
      }
      setFactorId(verified.id);
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!factorId || code.length !== 6) return;
    setError("");
    setLoading(true);

    try {
      const challengeRes = await fetch("/api/auth/mfa/totp/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ factorId }),
      });
      const challengeData = await challengeRes.json();
      if (!challengeRes.ok) throw new Error(challengeData.error ?? "challenge_failed");

      const verifyRes = await fetch("/api/auth/mfa/totp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          factorId,
          challengeId: challengeData.challengeId,
          code,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error ?? "verify_failed");

      router.push(next);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "verify_failed");
      setLoading(false);
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-xl font-semibold">{t("verify_title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("verify_subtitle")}
        </p>
      </div>

      {bootError ? (
        <div className="text-center space-y-3">
          <div className="flex items-center gap-2 text-sm text-red-500 justify-center">
            <AlertCircle className="h-4 w-4" /> {bootError}
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            {t("back_to_login")}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <OtpInput
            value={code}
            onChange={setCode}
            autoFocus
            disabled={loading || !factorId}
          />

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 justify-center">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !factorId || code.length !== 6}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("verify_cta")}
          </Button>
        </form>
      )}

      <div className="mt-6 text-center text-sm">
        <Link
          href="/auth/login"
          onClick={handleSignOut}
          className="text-muted-foreground hover:text-foreground"
        >
          {t("back_to_login")}
        </Link>
      </div>
    </Card>
  );
}

export default function Verify2faPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6 pt-16 bg-background">
        <Suspense
          fallback={
            <Card className="w-full max-w-md p-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </Card>
          }
        >
          <VerifyForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
