import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  pending: { label: "Pendiente", variant: "warning" },
  in_progress: { label: "En progreso", variant: "info" },
  review: { label: "En revisión", variant: "default" },
  completed: { label: "Completado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "danger" },
};

const priorityConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  low: { label: "Baja", variant: "default" },
  medium: { label: "Media", variant: "warning" },
  high: { label: "Alta", variant: "danger" },
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
  const status = statusConfig[project.status] || statusConfig.pending;
  const priority = priorityConfig[project.priority] || priorityConfig.medium;

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
          <Badge variant={status.variant}>{status.label}</Badge>
          <Badge variant={priority.variant}>{priority.label}</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
            <Calendar className="h-3 w-3" />
            {new Date(project.created_at).toLocaleDateString("es")}
          </span>
        </div>
      </Card>
    </Link>
  );
}
