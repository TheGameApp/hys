import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // 1. Run Supabase: refreshes session, computes AAL, may redirect for MFA gating.
  const supabaseRes = await updateSession(request);

  // If Supabase issued a redirect, honor it immediately (don't run intl on top).
  if (supabaseRes.status >= 300 && supabaseRes.status < 400) {
    return supabaseRes;
  }

  // 2. Run next-intl on the (possibly cookie-refreshed) request.
  const intlRes = intlMiddleware(request);

  // 3. Merge cookies from supabaseRes onto intlRes so the refreshed session sticks.
  supabaseRes.cookies.getAll().forEach((cookie) => {
    intlRes.cookies.set(cookie);
  });

  return intlRes;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
