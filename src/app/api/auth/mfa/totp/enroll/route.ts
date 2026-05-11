import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import { mfaLog } from "@/lib/mfa/log";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    mfaLog("warn", { event: "enroll_unauthorized" });
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  mfaLog("info", { event: "enroll_attempt", user_id: user.id });

  // Clean up any prior unverified TOTP factors to avoid duplicates.
  const { data: factorsData } = await supabase.auth.mfa.listFactors();
  let cleanedUp = 0;
  for (const factor of factorsData?.totp ?? []) {
    if (factor.status !== "verified") {
      await supabase.auth.mfa.unenroll({ factorId: factor.id });
      cleanedUp++;
    }
  }
  if (cleanedUp > 0) {
    mfaLog("info", {
      event: "enroll_cleaned_unverified",
      user_id: user.id,
      cleaned: cleanedUp,
    });
  }

  // Readable name shown in DB / listFactors / future UI (e.g. multi-factor list).
  // Includes time-of-day so it's still unique even if a user re-enrolls the
  // same day, satisfying auth.mfa_factors_user_friendly_name_unique.
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const friendlyName = `Authenticator App (${dd}/${mm}/${now.getFullYear()} ${hh}:${min})`;

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName,
  });

  if (error || !data) {
    mfaLog("error", {
      event: "enroll_failed",
      user_id: user.id,
      error: error?.message ?? "no_data",
    });
    return NextResponse.json(
      { error: error?.message ?? "enroll_failed" },
      { status: 400 }
    );
  }

  const qrCodeDataUrl = await QRCode.toDataURL(data.totp.uri, {
    margin: 1,
    width: 256,
  });

  mfaLog("info", {
    event: "enroll_factor_created",
    user_id: user.id,
    factor_id: data.id,
  });

  return NextResponse.json({
    factorId: data.id,
    secret: data.totp.secret,
    qrCodeDataUrl,
  });
}
