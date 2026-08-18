import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";

const priorityLabels: Record<string, string> = {
  low: "🟢 Baja",
  medium: "🟡 Media",
  high: "🔴 Alta",
};

const projectTypeLabels: Record<string, string> = {
  web: "Desarrollo Web & Móvil",
  software: "Software a Medida",
  consulting: "Consultoría & Staff Aug.",
  ai: "IA, Datos & Cloud",
  other: "Otro",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = { name: 120, email: 200, company: 160, message: 4000 };

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_IP = 5;
const MAX_PER_EMAIL = 3;
const hits = new Map<string, number[]>();

function rateLimited(key: string, max: number) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= max) return true;
  recent.push(now);
  hits.set(key, recent);
  return false;
}

function getClientIp(request: Request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      company,
      project_type,
      budget,
      priority,
      message,
      website,
    } = body ?? {};

    if (typeof website === "string" && website.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return NextResponse.json(
        { error: "Nombre, email y mensaje son requeridos" },
        { status: 400 }
      );
    }

    if (
      name.length > MAX_LEN.name ||
      email.length > MAX_LEN.email ||
      (typeof company === "string" && company.length > MAX_LEN.company) ||
      message.length > MAX_LEN.message
    ) {
      return NextResponse.json({ error: "Campos demasiado largos" }, { status: 400 });
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const ip = getClientIp(request);
    const emailKey = email.toLowerCase();
    if (rateLimited(`ip:${ip}`, MAX_PER_IP) || rateLimited(`em:${emailKey}`, MAX_PER_EMAIL)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Inténtalo más tarde." },
        { status: 429 }
      );
    }

    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      company: company ? escapeHtml(company) : "",
      message: escapeHtml(message),
      projectType: projectTypeLabels[project_type] || escapeHtml(project_type || "No especificado"),
      budget: budget ? escapeHtml(budget) : "No especificado",
      priority: priorityLabels[priority] || escapeHtml(priority || "Media"),
    };

    const adminHtml = `
      <div style="font-family: 'SF Mono', 'Fira Code', monospace; max-width: 600px; margin: 0 auto; border: 4px solid #000; padding: 0;">
        <div style="background-color: #000; color: #fff; padding: 16px 20px; text-transform: uppercase; font-size: 14px; font-weight: bold; letter-spacing: 1px;">
          🔥 Nuevo Ticket de Contacto — HyS Software
        </div>

        <div style="padding: 20px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px; vertical-align: top;">REMITENTE:</td>
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
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">TIPO DE PROYECTO:</td>
              <td style="padding: 8px 0;">
                <span style="background-color: #FF6B35; color: white; padding: 2px 8px; font-weight: bold; font-size: 12px;">
                  ${safe.projectType}
                </span>
              </td>
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
          </table>
        </div>

        <div style="border-top: 4px solid #000; padding: 20px;">
          <p style="font-weight: bold; text-transform: uppercase; margin: 0 0 10px 0; font-size: 13px;">MENSAJE_REMITIDO:</p>
          <div style="background-color: #f5f5f5; border: 2px solid #000; padding: 15px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">
            ${safe.message}
          </div>
        </div>

        <div style="padding: 16px 20px; text-align: center; border-top: 1px solid #e5e5e5;">
          <p style="font-size: 11px; margin: 0; font-weight: bold; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">
            Mensaje generado automáticamente desde HyS Software [Contact System]
          </p>
        </div>
      </div>
    `;

    const userHtml = `
      <div style="font-family: 'SF Mono', 'Fira Code', monospace; max-width: 600px; margin: 0 auto; border: 4px solid #000;">
        <div style="background-color: #000; color: #fff; padding: 16px 20px; text-transform: uppercase; font-size: 14px; font-weight: bold; letter-spacing: 1px;">
          ✅ Hemos recibido tu mensaje — HyS Software
        </div>
        <div style="padding: 24px; font-size: 14px; line-height: 1.6;">
          <p style="margin: 0 0 16px 0;">Hola <strong>${safe.name}</strong>,</p>
          <p style="margin: 0 0 16px 0;">
            Gracias por contactar a <strong>HyS Software</strong>. Hemos recibido tu mensaje y nuestro equipo
            te responderá lo antes posible al correo <a href="mailto:${safe.email}" style="color: #2563eb;">${safe.email}</a>.
          </p>
          <p style="margin: 0 0 8px 0; font-weight: bold; text-transform: uppercase; font-size: 12px;">Resumen de tu solicitud:</p>
          <div style="background-color: #f5f5f5; border: 2px solid #000; padding: 15px; margin-bottom: 16px;">
            <div><strong>Tipo:</strong> ${safe.projectType}</div>
            <div><strong>Presupuesto:</strong> ${safe.budget}</div>
            <div><strong>Prioridad:</strong> ${safe.priority}</div>
          </div>
          <p style="margin: 0 0 8px 0; font-weight: bold; text-transform: uppercase; font-size: 12px;">Tu mensaje:</p>
          <div style="background-color: #f5f5f5; border: 2px solid #000; padding: 15px; white-space: pre-wrap;">
            ${safe.message}
          </div>
          <p style="margin: 24px 0 0 0; font-size: 12px; color: #666;">
            Si no realizaste esta solicitud, puedes ignorar este correo.
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
      await Promise.all([
        resend.emails.send({
          from,
          to: adminTo,
          subject: `[HyS Software WEB] Nuevo contacto de: ${name}`,
          replyTo: email,
          html: adminHtml,
        }),
        resend.emails.send({
          from,
          to: email,
          subject: "Hemos recibido tu mensaje — HyS Software",
          replyTo: adminTo,
          html: userHtml,
        }),
      ]);
    } catch {
      console.error("Failed to send email notification");
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error al enviar el mensaje. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
