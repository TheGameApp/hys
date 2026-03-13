"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Menu } from "lucide-react";

const DashboardDecoration = dynamic(
  () => import("@/components/three/dashboard-decoration"),
  { ssr: false }
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-lg border-b border-border flex items-center px-4 gap-3 z-30 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-foreground cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-lg font-bold tracking-tight">
          Hy<span className="text-primary">S</span>
        </span>
      </div>

      <main className="flex-1 p-4 pt-18 md:p-8 md:pt-8">{children}</main>
      <DashboardDecoration />
    </div>
  );
}
