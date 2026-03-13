"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, DollarSign, Flag, User } from "lucide-react";
import Link from "next/link";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  pending: { label: "Pendiente", variant: "warning" },
  in_progress: { label: "En progreso", variant: "info" },
  review: { label: "En revisión", variant: "default" },
  completed: { label: "Completado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "danger" },
};

const statuses = ["pending", "in_progress", "review", "completed", "cancelled"];
const priorities = ["low", "medium", "high"];

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  budget_range: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { full_name: string | null; company: string | null } | null;
}

export default function AdminProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("*, profiles(full_name, company)")
        .eq("id", id)
        .single();
      setProject(data);
    }
    load();
  }, [id]);

  async function updateField(field: string, value: string) {
    const supabase = createClient();
    await supabase
      .from("projects")
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq("id", id);
    setProject((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  if (!project) {
    return <p className="text-muted-foreground">Cargando...</p>;
  }

  const status = statusConfig[project.status] || statusConfig.pending;

  return (
    <div>
      <Link href="/admin">
        <Button variant="ghost" size="sm" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <h2 className="font-semibold mb-3">Descripción</h2>
          <p className="text-muted-foreground leading-relaxed">
            {project.description || "Sin descripción"}
          </p>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Detalles</h3>
            <div className="space-y-3">
              {project.profiles && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{project.profiles.full_name} ({project.profiles.company})</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(project.created_at).toLocaleDateString("es")}</span>
              </div>
              {project.budget_range && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>{project.budget_range}</span>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Cambiar estado
            </h3>
            <select
              value={project.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {statusConfig[s]?.label || s}
                </option>
              ))}
            </select>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Cambiar prioridad
            </h3>
            <select
              value={project.priority}
              onChange={(e) => updateField("priority", e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {priorities.map((p) => (
                <option key={p} value={p} className="capitalize">
                  {p === "low" ? "Baja" : p === "medium" ? "Media" : "Alta"}
                </option>
              ))}
            </select>
          </Card>
        </div>
      </div>
    </div>
  );
}
