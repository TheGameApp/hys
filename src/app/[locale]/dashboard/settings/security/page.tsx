import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { SecurityPanel } from "@/components/mfa/security-panel";

interface PageProps {
  searchParams: Promise<{ force?: string }>;
}

export default async function SecuritySettingsPage({ searchParams }: PageProps) {
  const t = await getTranslations("mfa");
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasTotp = false;
  let isAdmin = false;

  if (user) {
    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    hasTotp = (factorsData?.totp ?? []).some((f) => f.status === "verified");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <div className="max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{t("page_title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("page_subtitle")}</p>
      </header>

      <SecurityPanel
        hasTotp={hasTotp}
        isAdmin={isAdmin}
        showForceBanner={params.force === "true"}
      />
    </div>
  );
}
