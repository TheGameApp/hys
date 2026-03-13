"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const company = formData.get("company") as string;

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, company } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center px-6 pt-16 bg-background">
          <Card className="w-full max-w-md p-8 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">{t("register_success_title")}</h1>
            <p className="text-sm text-muted-foreground mb-6">{t("register_success_msg")}</p>
            <Link href="/auth/login">
              <Button variant="outline">{t("go_login")}</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6 pt-16 bg-background">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Hy<span className="text-primary">S</span>
            </Link>
            <h1 className="text-xl font-semibold mt-4">{t("register_title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("register_subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1.5">{t("full_name")}</label>
              <Input id="fullName" name="fullName" placeholder={t("full_name")} required />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-1.5">{t("company")}</label>
              <Input id="company" name="company" placeholder={t("company")} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">{t("email")}</label>
              <Input id="email" name="email" type="email" placeholder="tu@empresa.com" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">{t("password")}</label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder={t("password_placeholder")} className="pr-10" minLength={6} required />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? t("hide_password") : t("show_password")}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("registering") : t("register_cta")}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("has_account")}{" "}
            <Link href="/auth/login" className="text-foreground font-medium hover:underline">
              {t("login_link")}
            </Link>
          </p>
        </Card>
      </main>
      <Footer />
    </>
  );
}
