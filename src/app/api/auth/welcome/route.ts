import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = { email: 200, fullName: 120, company: 160 };

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
    const { email, fullName, company } = body ?? {};

    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    if (
      email.length > MAX_LEN.email ||
      (typeof fullName === "string" && fullName.length > MAX_LEN.fullName) ||
      (typeof company === "string" && company.length > MAX_LEN.company)
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
      email: escapeHtml(email),
      fullName: fullName ? escapeHtml(String(fullName)) : "",
      company: company ? escapeHtml(String(company)) : "",
    };

    const greeting = safe.fullName ? `Hola <strong>${safe.fullName}</strong>,` : "Hola,";

    const userHtml = `
      <div style="font-family: 'SF Mono', 'Fira Code', monospace; max-width: 600px; margin: 0 auto; border: 4px solid #000;">
        <div style="background-color: #000; color: #fff; padding: 16px 20px; text-transform: uppercase; font-size: 14px; font-weight: bold; letter-spacing: 1px;">
          ✅ Cuenta creada — HyS Software
        </div>
        <div style="padding: 24px; font-size: 14px; line-height: 1.6;">
          <p style="margin: 0 0 16px 0;">${greeting}</p>
          <p style="margin: 0 0 16px 0;">
            Te confirmamos que se ha creado una nueva cuenta en <strong>HyS Software</strong> con el correo
            <a href="mailto:${safe.email}" style="color: #2563eb;">${safe.email}</a>.
          </p>
          <div style="background-color: #f5f5f5; border: 2px solid #000; padding: 15px; margin-bottom: 16px;">
            <div><strong>Email:</strong> ${safe.email}</div>
            ${safe.fullName ? `<div><strong>Nombre:</strong> ${safe.fullName}</div>` : ""}
            ${safe.company ? `<div><strong>Empresa:</strong> ${safe.company}</div>` : ""}
          </div>
          <p style="margin: 0 0 16px 0;">
            Ya puedes iniciar sesión con tus credenciales. Si no fuiste tú quien creó esta cuenta,
            por favor contáctanos de inmediato.
          </p>
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

    const adminHtml = `
      <div style="font-family: 'SF Mono', 'Fira Code', monospace; max-width: 600px; margin: 0 auto; border: 4px solid #000; padding: 0;">
        <div style="background-color: #000; color: #fff; padding: 16px 20px; text-transform: uppercase; font-size: 14px; font-weight: bold; letter-spacing: 1px;">
          👤 Nuevo usuario registrado — HyS Software
        </div>
        <div style="padding: 20px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px; vertical-align: top;">EMAIL:</td>
              <td style="padding: 8px 0;"><a href="mailto:${safe.email}" style="color: #2563eb;">${safe.email}</a></td>
            </tr>
            ${
              safe.fullName
                ? `<tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">NOMBRE:</td><td style="padding: 8px 0;">${safe.fullName}</td></tr>`
                : ""
            }
            ${
              safe.company
                ? `<tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">EMPRESA:</td><td style="padding: 8px 0;">${safe.company}</td></tr>`
                : ""
            }
          </table>
        </div>
        <div style="padding: 16px 20px; text-align: center; border-top: 1px solid #e5e5e5;">
          <p style="font-size: 11px; margin: 0; font-weight: bold; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">
            Notificación generada automáticamente desde HyS Software [Auth System]
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
          to: email,
          subject: "Cuenta creada — HyS Software",
          replyTo: adminTo,
          html: userHtml,
        }),
        resend.emails.send({
          from,
          to: adminTo,
          subject: `[HyS Software WEB] Nuevo usuario registrado: ${email}`,
          html: adminHtml,
        }),
      ]);
    } catch {
      console.error("Failed to send welcome email");
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error al enviar el correo de bienvenida." },
      { status: 500 }
    );
  }
}
