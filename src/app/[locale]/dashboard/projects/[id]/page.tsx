"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, DollarSign, Flag } from "lucide-react";
import Link from "next/link";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

const statusVariants: Record<string, BadgeVariant> = {
  pending: "warning",
  in_progress: "info",
  review: "default",
  completed: "success",
  cancelled: "danger",
};

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  budget_range: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      setProject(data);
    }
    load();
  }, [id]);

  if (!project) {
    return <p className="text-muted-foreground">{t("loading")}</p>;
  }

  const statusVariant = statusVariants[project.status] ?? "warning";

  return (
    <div>
      <Link href="/dashboard/projects">
        <Button variant="ghost" size="sm" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </Button>
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant={statusVariant}>{t(`status_${project.status}`)}</Badge>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <h2 className="font-semibold mb-3">{t("detail_description")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {project.description || t("no_description")}
          </p>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">{t("details")}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {t("created")}: {new Date(project.created_at).toLocaleDateString(locale)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {t("updated")}: {new Date(project.updated_at).toLocaleDateString(locale)}
                </span>
              </div>
              {project.budget_range && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {t("budget_label")}: {project.budget_range}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Flag className="h-4 w-4 text-muted-foreground" />
                <span>
                  {t("priority_label")}: {t(`priority_${project.priority}`)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
