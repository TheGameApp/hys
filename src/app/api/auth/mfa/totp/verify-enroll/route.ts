import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mfaLog } from "@/lib/mfa/log";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    mfaLog("warn", { event: "verify_enroll_unauthorized" });
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const factorId = body?.factorId as string | undefined;
  const code = body?.code as string | undefined;

  if (!factorId || !code) {
    mfaLog("warn", {
      event: "verify_enroll_missing_fields",
      user_id: user.id,
      has_factor_id: !!factorId,
      has_code: !!code,
    });
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const { data: challengeData, error: challengeError } =
    await supabase.auth.mfa.challenge({ factorId });

  if (challengeError || !challengeData) {
    mfaLog("error", {
      event: "verify_enroll_challenge_failed",
      user_id: user.id,
      factor_id: factorId,
      error: challengeError?.message ?? "no_data",
    });
    return NextResponse.json(
      { error: challengeError?.message ?? "challenge_failed" },
      { status: 400 }
    );
  }

  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challengeData.id,
    code,
  });

  if (verifyError) {
    mfaLog("warn", {
      event: "verify_enroll_invalid_code",
      user_id: user.id,
      factor_id: factorId,
      challenge_id: challengeData.id,
      error: verifyError.message,
    });
    return NextResponse.json({ error: verifyError.message }, { status: 400 });
  }

  mfaLog("info", {
    event: "verify_enroll_success",
    user_id: user.id,
    factor_id: factorId,
  });

  return NextResponse.json({ ok: true });
}
