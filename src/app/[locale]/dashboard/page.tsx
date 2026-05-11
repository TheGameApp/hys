"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { ProjectCard } from "@/components/dashboard/project-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  FolderGit2,
  AlertTriangle,
  Plus,
  Shield,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  created_at: string;
}

interface Profile {
  full_name: string | null;
}

export default function DashboardHomePage() {
  const t = useTranslations("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const [projectsRes, profileRes] = await Promise.all([
        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false }),
        user
          ? supabase.from("profiles").select("full_name").eq("id", user.id).single()
          : Promise.resolve({ data: null }),
      ]);

      setProjects(projectsRes.data || []);
      setProfile(profileRes.data ?? null);
      setLoading(false);
    }
    load();
  }, []);

  const counts = {
    total: projects.length,
    pending: projects.filter((p) => p.status === "pending").length,
    in_progress: projects.filter((p) => p.status === "in_progress").length,
    completed: projects.filter((p) => p.status === "completed").length,
  };

  const recent = projects.slice(0, 4);
  const firstName = profile?.full_name?.split(" ")[0] ?? "";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {t("welcome_back")}
          {firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{t("home_subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="flex items-center gap-3">
          <FolderGit2 className="h-8 w-8 text-primary" />
          <div>
            <div className="text-2xl font-bold">
              <AnimatedCounter end={counts.total} />
            </div>
            <p className="text-xs text-muted-foreground">{t("stat_total")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-amber-500" />
          <div>
            <div className="text-2xl font-bold">
              <AnimatedCounter end={counts.pending} />
            </div>
            <p className="text-xs text-muted-foreground">{t("stat_pending")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-blue-500" />
          <div>
            <div className="text-2xl font-bold">
              <AnimatedCounter end={counts.in_progress} />
            </div>
            <p className="text-xs text-muted-foreground">{t("stat_in_progress")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
          <div>
            <div className="text-2xl font-bold">
              <AnimatedCounter end={counts.completed} />
            </div>
            <p className="text-xs text-muted-foreground">{t("stat_completed")}</p>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t("recent_projects")}</h2>
            <Link
              href="/dashboard/projects"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              {t("view_all_projects")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <p className="text-muted-foreground">{t("loading")}</p>
          ) : recent.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">{t("empty")}</p>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {recent.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">{t("quick_actions")}</h2>
          <Card className="space-y-3">
            <Link href="/dashboard/projects" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" />
                {t("action_new_request")}
              </Button>
            </Link>
            <Link href="/dashboard/settings/security" className="block">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Shield className="h-4 w-4" />
                {t("action_security")}
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
