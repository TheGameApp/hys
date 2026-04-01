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

export async function POST(request: Request) {
  try {
    const { name, email, company, project_type, budget, priority, message } =
      await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nombre, email y mensaje son requeridos" },
        { status: 400 }
      );
    }

    const htmlContent = `
      <div style="font-family: 'SF Mono', 'Fira Code', monospace; max-width: 600px; margin: 0 auto; border: 4px solid #000; padding: 0;">
        <div style="background-color: #000; color: #fff; padding: 16px 20px; text-transform: uppercase; font-size: 14px; font-weight: bold; letter-spacing: 1px;">
          🔥 Nuevo Ticket de Contacto — HyS Software
        </div>

        <div style="padding: 20px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px; vertical-align: top;">REMITENTE:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">EMAIL:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">EMPRESA:</td>
              <td style="padding: 8px 0;">${company || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">TIPO DE PROYECTO:</td>
              <td style="padding: 8px 0;">
                <span style="background-color: #FF6B35; color: white; padding: 2px 8px; font-weight: bold; font-size: 12px;">
                  ${projectTypeLabels[project_type] || project_type || "No especificado"}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">PRESUPUESTO:</td>
              <td style="padding: 8px 0;">
                <span style="background-color: #10b981; color: white; padding: 2px 8px; font-weight: bold; font-size: 12px;">
                  ${budget || "No especificado"}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">PRIORIDAD:</td>
              <td style="padding: 8px 0;">${priorityLabels[priority] || priority || "Media"}</td>
            </tr>
          </table>
        </div>

        <div style="border-top: 4px solid #000; padding: 20px;">
          <p style="font-weight: bold; text-transform: uppercase; margin: 0 0 10px 0; font-size: 13px;">MENSAJE_REMITIDO:</p>
          <div style="background-color: #f5f5f5; border: 2px solid #000; padding: 15px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">
            ${message}
          </div>
        </div>

        <div style="padding: 16px 20px; text-align: center; border-top: 1px solid #e5e5e5;">
          <p style="font-size: 11px; margin: 0; font-weight: bold; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">
            Mensaje generado automáticamente desde HyS Software [Contact System]
          </p>
        </div>
      </div>
    `;

    try {
      await getResend().emails.send({
        from: "HyS Software Contact <onboarding@resend.dev>",
        to: process.env.CONTACT_EMAIL || "contacto@hyssoftware.com",
        subject: `[HyS Software WEB] Nuevo contacto de: ${name}`,
        replyTo: email,
        html: htmlContent,
      });
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
