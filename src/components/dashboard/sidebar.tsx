"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderGit2,
  LogOut,
  MessageSquare,
  Shield,
  Users,
  X,
} from "lucide-react";

interface SidebarProps {
  isAdmin?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isAdmin = false, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("sidebar");

  const clientLinks = [
    { href: "/dashboard", label: t("home"), icon: LayoutDashboard },
    { href: "/dashboard/projects", label: t("my_projects"), icon: FolderGit2 },
    { href: "/dashboard/settings/security", label: t("security"), icon: Shield },
  ];

  const adminLinks = [
    { href: "/admin", label: t("home"), icon: LayoutDashboard },
    { href: "/admin/projects", label: t("projects"), icon: FolderGit2 },
    { href: "/admin/messages", label: t("messages"), icon: MessageSquare },
    { href: "/admin/users", label: t("users"), icon: Users },
    { href: "/dashboard/settings/security", label: t("security"), icon: Shield },
  ];

  const links = isAdmin ? adminLinks : clientLinks;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function SidebarContent() {
    return (
      <>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              Hy<span className="text-primary">S</span>
            </Link>
            <p className="text-xs text-muted-foreground mt-1">
              {isAdmin ? t("admin_panel") : "Dashboard"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                pathname === link.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent w-full transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border bg-card min-h-screen flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-card border-r border-border z-50 flex flex-col md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
