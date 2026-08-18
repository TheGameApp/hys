import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getResend } from "@/lib/resend";

const MAX_LEN = { title: 200, description: 4000, budget: 50 };
const PRIORITIES = ["low", "medium", "high"] as const;

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_USER = 10;
const hits = new Map<string, number[]>();

function rateLimited(key: string, max: number) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= max) return true;
  recent.push(now);
  hits.set(key, recent);
  return false;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const priorityLabels: Record<string, string> = {
  low: "🟢 Baja",
  medium: "🟡 Media",
  high: "🔴 Alta",
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, budget, priority } = body ?? {};

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "El título es requerido" }, { status: 400 });
    }

    if (
      title.length > MAX_LEN.title ||
      (typeof description === "string" && description.length > MAX_LEN.description) ||
      (typeof budget === "string" && budget.length > MAX_LEN.budget)
    ) {
      return NextResponse.json({ error: "Campos demasiado largos" }, { status: 400 });
    }

    const safePriority =
      typeof priority === "string" && (PRIORITIES as readonly string[]).includes(priority)
        ? (priority as (typeof PRIORITIES)[number])
        : "medium";

    if (rateLimited(`proj:${user.id}`, MAX_PER_USER)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Inténtalo más tarde." },
        { status: 429 }
      );
    }

    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        client_id: user.id,
        title: title.trim(),
        description: typeof description === "string" && description ? description : null,
        budget_range: typeof budget === "string" && budget ? budget : null,
        priority: safePriority,
      })
      .select()
      .single();

    if (error || !project) {
      return NextResponse.json({ error: "No se pudo crear el proyecto" }, { status: 500 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, company")
      .eq("id", user.id)
      .single();

    const safe = {
      title: escapeHtml(project.title),
      description: project.description ? escapeHtml(project.description) : "Sin descripción",
      budget: project.budget_range ? escapeHtml(project.budget_range) : "No especificado",
      priority: priorityLabels[project.priority] || escapeHtml(project.priority),
      name: escapeHtml(profile?.full_name || "Cliente"),
      email: escapeHtml(user.email || ""),
      company: escapeHtml(profile?.company || ""),
      id: escapeHtml(project.id),
    };

    const adminHtml = `
      <div style="font-family: 'SF Mono', 'Fira Code', monospace; max-width: 600px; margin: 0 auto; border: 4px solid #000;">
        <div style="background-color: #000; color: #fff; padding: 16px 20px; text-transform: uppercase; font-size: 14px; font-weight: bold; letter-spacing: 1px;">
          🆕 Nueva Petición de Proyecto — HyS Software
        </div>
        <div style="padding: 20px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px; vertical-align: top;">CLIENTE:</td>
              <td style="padding: 8px 0;">${safe.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">EMAIL:</td>
              <td style="padding: 8px 0;"><a href="mailto:${safe.email}" style="color: #2563eb;">${safe.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">EMPRESA:</td>
              <td style="padding: 8px 0;">${safe.company || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">TÍTULO:</td>
              <td style="padding: 8px 0;">${safe.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">PRESUPUESTO:</td>
              <td style="padding: 8px 0;">
                <span style="background-color: #10b981; color: white; padding: 2px 8px; font-weight: bold; font-size: 12px;">
                  ${safe.budget}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">PRIORIDAD:</td>
              <td style="padding: 8px 0;">${safe.priority}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">ID:</td>
              <td style="padding: 8px 0; font-size: 11px; color: #888;">${safe.id}</td>
            </tr>
          </table>
        </div>
        <div style="border-top: 4px solid #000; padding: 20px;">
          <p style="font-weight: bold; text-transform: uppercase; margin: 0 0 10px 0; font-size: 13px;">DESCRIPCIÓN:</p>
          <div style="background-color: #f5f5f5; border: 2px solid #000; padding: 15px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">
            ${safe.description}
          </div>
        </div>
        <div style="padding: 16px 20px; text-align: center; border-top: 1px solid #e5e5e5;">
          <p style="font-size: 11px; margin: 0; font-weight: bold; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">
            Petición creada desde el dashboard de HyS Software
          </p>
        </div>
      </div>
    `;

    const userHtml = `
      <div style="font-family: 'SF Mono', 'Fira Code', monospace; max-width: 600px; margin: 0 auto; border: 4px solid #000;">
        <div style="background-color: #000; color: #fff; padding: 16px 20px; text-transform: uppercase; font-size: 14px; font-weight: bold; letter-spacing: 1px;">
          ✅ Solicitud Recibida — HyS Software
        </div>
        <div style="padding: 24px; font-size: 14px; line-height: 1.6;">
          <p style="margin: 0 0 16px 0;">Hola <strong>${safe.name}</strong>,</p>
          <p style="margin: 0 0 16px 0;">
            Hemos recibido tu nueva petición de proyecto. Nuestro equipo la revisará y te contactará pronto.
          </p>
          <p style="margin: 0 0 8px 0; font-weight: bold; text-transform: uppercase; font-size: 12px;">Detalles:</p>
          <div style="background-color: #f5f5f5; border: 2px solid #000; padding: 15px; margin-bottom: 16px;">
            <div><strong>Título:</strong> ${safe.title}</div>
            <div><strong>Presupuesto:</strong> ${safe.budget}</div>
            <div><strong>Prioridad:</strong> ${safe.priority}</div>
          </div>
          <p style="margin: 0 0 8px 0; font-weight: bold; text-transform: uppercase; font-size: 12px;">Descripción:</p>
          <div style="background-color: #f5f5f5; border: 2px solid #000; padding: 15px; white-space: pre-wrap;">
            ${safe.description}
          </div>
          <p style="margin: 24px 0 0 0; font-size: 12px; color: #666;">
            Puedes consultar el estado de tu petición desde tu dashboard.
          </p>
        </div>
        <div style="padding: 16px 20px; text-align: center; border-top: 1px solid #e5e5e5;">
          <p style="font-size: 11px; margin: 0; font-weight: bold; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">
            HyS Software — Mensaje automático, no respondas a este correo.
          </p>
        </div>
      </div>
    `;

    const resend = getResend();
    const from = process.env.RESEND_FROM || "HyS Software <onboarding@resend.dev>";
    const adminTo = process.env.CONTACT_EMAIL || "contacto@hysdevs.com";

    try {
      const emails: Promise<unknown>[] = [
        resend.emails.send({
          from,
          to: adminTo,
          subject: `[HyS Software] Nueva petición: ${project.title}`,
          replyTo: user.email || undefined,
          html: adminHtml,
        }),
      ];
      if (user.email) {
        emails.push(
          resend.emails.send({
            from,
            to: user.email,
            subject: "Solicitud recibida — HyS Software",
            replyTo: adminTo,
            html: userHtml,
          })
        );
      }
      await Promise.all(emails);
    } catch {
      console.error("Failed to send project email notification");
    }

    return NextResponse.json({ success: true, project });
  } catch {
    return NextResponse.json(
      { error: "Error al crear el proyecto. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
