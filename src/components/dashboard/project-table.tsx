import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
  status: string;
  priority: string;
  created_at: string;
  profiles?: { full_name: string | null; company: string | null } | null;
}

interface ProjectTableProps {
  projects: Project[];
  basePath?: string;
}

export function ProjectTable({ projects, basePath = "/admin" }: ProjectTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3 font-medium">Proyecto</th>
            <th className="text-left p-3 font-medium">Cliente</th>
            <th className="text-left p-3 font-medium">Estado</th>
            <th className="text-left p-3 font-medium">Prioridad</th>
            <th className="text-left p-3 font-medium">Fecha</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {projects.map((project) => {
            const status = statusConfig[project.status] || statusConfig.pending;
            const priority = priorityConfig[project.priority] || priorityConfig.medium;
            return (
              <tr key={project.id} className="hover:bg-accent/50 transition-colors">
                <td className="p-3">
                  <Link
                    href={`${basePath}/projects/${project.id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {project.title}
                  </Link>
                </td>
                <td className="p-3 text-muted-foreground">
                  {project.profiles?.full_name || "—"}
                </td>
                <td className="p-3">
                  <Badge variant={status.variant}>{status.label}</Badge>
                </td>
                <td className="p-3">
                  <Badge variant={priority.variant}>{priority.label}</Badge>
                </td>
                <td className="p-3 text-muted-foreground">
                  {new Date(project.created_at).toLocaleDateString("es")}
                </td>
              </tr>
            );
          })}
          {projects.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-muted-foreground">
                No hay proyectos aún
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
