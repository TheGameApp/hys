"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageLinks = [
    { href: "/nosotros", label: t("about") },
    { href: "/blog", label: t("blog") },
  ];

  const navLinks = [
    { href: "#servicios", label: t("services") },
    { href: "#proceso", label: t("process") },
    { href: "#tecnologias", label: t("technologies") },
    { href: "#precios", label: t("pricing") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 h-16">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-auto text-foreground" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
          {pageLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">{t("login")}</Button>
          </Link>
          <a href="#contacto">
            <Button size="sm">{t("contact")}</Button>
          </a>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-foreground cursor-pointer">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 pb-4">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
          {pageLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 mt-3">
            <Link href="/auth/login" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">{t("login")}</Button>
            </Link>
            <a href="#contacto" className="flex-1">
              <Button size="sm" className="w-full">{t("contact")}</Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
