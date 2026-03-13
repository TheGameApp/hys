"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProjectTable } from "@/components/dashboard/project-table";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { FolderGit2, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface Project {
  id: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
  profiles?: { full_name: string | null; company: string | null } | null;
}

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("*, profiles(full_name, company)")
        .order("created_at", { ascending: false });
      setProjects(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.status === filter);

  const counts = {
    total: projects.length,
    pending: projects.filter((p) => p.status === "pending").length,
    in_progress: projects.filter((p) => p.status === "in_progress").length,
    completed: projects.filter((p) => p.status === "completed").length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gestiona todas las peticiones y proyectos
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="flex items-center gap-3 cursor-pointer" onClick={() => setFilter("all")}>
          <FolderGit2 className="h-8 w-8 text-primary" />
          <div>
            <div className="text-2xl font-bold">
              <AnimatedCounter end={counts.total} />
            </div>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 cursor-pointer" onClick={() => setFilter("pending")}>
          <Clock className="h-8 w-8 text-amber-500" />
          <div>
            <div className="text-2xl font-bold">
              <AnimatedCounter end={counts.pending} />
            </div>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 cursor-pointer" onClick={() => setFilter("in_progress")}>
          <AlertTriangle className="h-8 w-8 text-blue-500" />
          <div>
            <div className="text-2xl font-bold">
              <AnimatedCounter end={counts.in_progress} />
            </div>
            <p className="text-xs text-muted-foreground">En progreso</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 cursor-pointer" onClick={() => setFilter("completed")}>
          <CheckCircle className="h-8 w-8 text-emerald-500" />
          <div>
            <div className="text-2xl font-bold">
              <AnimatedCounter end={counts.completed} />
            </div>
            <p className="text-xs text-muted-foreground">Completados</p>
          </div>
        </Card>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : (
        <ProjectTable projects={filtered} />
      )}
    </div>
  );
}
