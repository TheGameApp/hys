import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mfaLog } from "@/lib/mfa/log";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    mfaLog("warn", { event: "challenge_unauthorized" });
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const factorId = body?.factorId as string | undefined;
  if (!factorId) {
    mfaLog("warn", { event: "challenge_missing_factor", user_id: user.id });
    return NextResponse.json({ error: "missing_factor_id" }, { status: 400 });
  }

  const { data, error } = await supabase.auth.mfa.challenge({ factorId });
  if (error || !data) {
    mfaLog("error", {
      event: "challenge_failed",
      user_id: user.id,
      factor_id: factorId,
      error: error?.message ?? "no_data",
    });
    return NextResponse.json(
      { error: error?.message ?? "challenge_failed" },
      { status: 400 }
    );
  }

  mfaLog("info", {
    event: "challenge_issued",
    user_id: user.id,
    factor_id: factorId,
    challenge_id: data.id,
  });

  return NextResponse.json({ challengeId: data.id });
}
