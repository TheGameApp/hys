"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Calendar, ArrowRight } from "lucide-react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

const statusVariants: Record<string, BadgeVariant> = {
  pending: "warning",
  in_progress: "info",
  review: "default",
  completed: "success",
  cancelled: "danger",
};

const priorityVariants: Record<string, BadgeVariant> = {
  low: "default",
  medium: "warning",
  high: "danger",
};

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  created_at: string;
}

interface ProjectCardProps {
  project: Project;
  basePath?: string;
}

export function ProjectCard({ project, basePath = "/dashboard" }: ProjectCardProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const statusVariant = statusVariants[project.status] ?? "warning";
  const priorityVariant = priorityVariants[project.priority] ?? "warning";

  return (
    <Link href={`${basePath}/projects/${project.id}`}>
      <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {project.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={statusVariant}>{t(`status_${project.status}`)}</Badge>
          <Badge variant={priorityVariant}>{t(`priority_${project.priority}`)}</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
            <Calendar className="h-3 w-3" />
            {new Date(project.created_at).toLocaleDateString(locale)}
          </span>
        </div>
      </Card>
    </Link>
  );
}
