import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { mfaLog } from "@/lib/mfa/log";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    mfaLog("warn", { event: "disable_unauthorized" });
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const password = body?.password as string | undefined;
  if (!password) {
    mfaLog("warn", { event: "disable_password_missing", user_id: user.id });
    return NextResponse.json({ error: "password_required" }, { status: 400 });
  }

  mfaLog("info", { event: "disable_attempt", user_id: user.id });

  // Verify the password on a throwaway client so the user's real cookie session
  // is not replaced with a new AAL1 session (which would break the unenroll
  // step that Supabase only allows at AAL2 via the user-scoped API).
  const verifyClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  const { error: reauthError } = await verifyClient.auth.signInWithPassword({
    email: user.email,
    password,
  });
  if (reauthError) {
    mfaLog("warn", {
      event: "disable_password_invalid",
      user_id: user.id,
      error: reauthError.message,
    });
    return NextResponse.json({ error: "invalid_password" }, { status: 400 });
  }

  // Use the admin (service_role) API to delete MFA factors — this bypasses
  // the AAL2 requirement of the user-scoped mfa.unenroll() call.
  const admin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const { data: factorsData, error: listError } = await admin.auth.admin.mfa.listFactors({
    userId: user.id,
  });
  if (listError) {
    mfaLog("error", {
      event: "disable_list_factors_failed",
      user_id: user.id,
      error: listError.message,
    });
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const factors = factorsData?.factors ?? [];
  for (const factor of factors) {
    const { error: deleteError } = await admin.auth.admin.mfa.deleteFactor({
      userId: user.id,
      id: factor.id,
    });
    if (deleteError) {
      mfaLog("error", {
        event: "disable_delete_factor_failed",
        user_id: user.id,
        factor_id: factor.id,
        error: deleteError.message,
      });
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
    mfaLog("info", {
      event: "disable_factor_deleted",
      user_id: user.id,
      factor_id: factor.id,
      factor_type: factor.factor_type,
    });
  }

  await supabase.auth.signOut({ scope: "global" });

  mfaLog("info", {
    event: "disable_complete",
    user_id: user.id,
    factors_deleted: factors.length,
  });

  return NextResponse.json({ ok: true });
}
