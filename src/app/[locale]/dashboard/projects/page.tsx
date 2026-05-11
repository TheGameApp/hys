"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { ProjectCard } from "@/components/dashboard/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  created_at: string;
}

export default function ProjectsListPage() {
  const t = useTranslations("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    const supabase = createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    setProjects(data || []);
    setLoading(false);
  }

  useEffect(() => {
    async function init() {
      await loadProjects();
    }
    init();
  }, []);

  async function handleCreateProject(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        budget: formData.get("budget"),
        priority: formData.get("priority"),
      }),
    });

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Error" }));
      alert(error || "Error al crear el proyecto");
      return;
    }

    setShowForm(false);
    loadProjects();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("subtitle")}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? t("cancel") : t("new_request")}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 p-6">
          <h2 className="text-lg font-semibold mb-4">{t("new_form_title")}</h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1.5">
                {t("project_title")} *
              </label>
              <Input id="title" name="title" placeholder={t("project_title_placeholder")} required />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1.5">
                {t("description")}
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder={t("description_placeholder")}
                className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium mb-1.5">
                  {t("budget")}
                </label>
                <select
                  id="budget"
                  name="budget"
                  className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="">{t("select")}</option>
                  <option value="$1k-$5k">$1,000 - $5,000</option>
                  <option value="$5k-$15k">$5,000 - $15,000</option>
                  <option value="$15k-$50k">$15,000 - $50,000</option>
                  <option value="$50k+">$50,000+</option>
                </select>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium mb-1.5">
                  {t("priority")}
                </label>
                <select
                  id="priority"
                  name="priority"
                  defaultValue="medium"
                  className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="low">{t("priority_low")}</option>
                  <option value="medium">{t("priority_medium")}</option>
                  <option value="high">{t("priority_high")}</option>
                </select>
              </div>
            </div>
            <Button type="submit">{t("submit")}</Button>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground">{t("loading")}</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {projects.length === 0 && (
            <Card className="col-span-full p-12 text-center">
              <p className="text-muted-foreground">
                {t("empty")}
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
