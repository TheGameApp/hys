"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: "es" | "en") {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center border border-border rounded-full overflow-hidden text-xs font-medium">
      <button
        onClick={() => switchLocale("es")}
        className={`px-2.5 py-1 transition-colors cursor-pointer ${
          locale === "es" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        ES
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={`px-2.5 py-1 transition-colors cursor-pointer ${
          locale === "en" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
}
