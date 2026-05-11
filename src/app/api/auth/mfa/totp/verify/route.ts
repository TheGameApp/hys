import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mfaLog } from "@/lib/mfa/log";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    mfaLog("warn", { event: "verify_unauthorized" });
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const factorId = body?.factorId as string | undefined;
  const challengeId = body?.challengeId as string | undefined;
  const code = body?.code as string | undefined;

  if (!factorId || !challengeId || !code) {
    mfaLog("warn", {
      event: "verify_missing_fields",
      user_id: user.id,
      has_factor_id: !!factorId,
      has_challenge_id: !!challengeId,
      has_code: !!code,
    });
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const { error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId,
    code,
  });

  if (error) {
    mfaLog("warn", {
      event: "verify_invalid_code",
      user_id: user.id,
      factor_id: factorId,
      challenge_id: challengeId,
      error: error.message,
    });
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  mfaLog("info", {
    event: "verify_success",
    user_id: user.id,
    factor_id: factorId,
  });

  return NextResponse.json({ ok: true });
}
