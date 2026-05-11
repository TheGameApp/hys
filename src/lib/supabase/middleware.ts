import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["es", "en"];

function stripLocale(pathname: string): { locale: string | null; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && LOCALES.includes(segments[0])) {
    return { locale: segments[0], path: "/" + segments.slice(1).join("/") };
  }
  return { locale: null, path: pathname };
}

function buildLocalizedUrl(
  request: NextRequest,
  locale: string | null,
  path: string,
  searchParams?: Record<string, string>
) {
  const url = request.nextUrl.clone();
  url.pathname = locale ? `/${locale}${path}` : path;
  url.search = "";
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) url.searchParams.set(k, v);
  }
  return url;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { locale, path } = stripLocale(request.nextUrl.pathname);

  const isProtected = path.startsWith("/dashboard") || path.startsWith("/admin");
  const isAdminRoute = path.startsWith("/admin");
  const isVerify2fa = path === "/auth/2fa/verify";
  const isSecuritySettings = path === "/dashboard/settings/security";

  // Not authenticated trying to reach protected route → login
  if (isProtected && !user) {
    return NextResponse.redirect(buildLocalizedUrl(request, locale, "/auth/login"));
  }

  if (!user) return supabaseResponse;

  // Determine AAL state + whether step-up is required
  const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const needsStepUp =
    aalData?.nextLevel === "aal2" && aalData?.currentLevel === "aal1";

  // Step-up required → force /auth/2fa/verify on any protected route.
  // Pass `next` WITHOUT the locale prefix because the next-intl router on the
  // verify page re-prepends it; sending the localized path causes double prefix
  // and a 404 (e.g. /es/es/dashboard/...).
  if (isProtected && needsStepUp && !isVerify2fa) {
    return NextResponse.redirect(
      buildLocalizedUrl(request, locale, "/auth/2fa/verify", {
        next: path + request.nextUrl.search,
      })
    );
  }

  // User is already AAL2 but visiting the verify page → bounce to `next` or dashboard.
  if (isVerify2fa && !needsStepUp) {
    const next = request.nextUrl.searchParams.get("next") ?? "/dashboard";
    const url = request.nextUrl.clone();
    url.pathname = next.startsWith("/") ? next : `/${next}`;
    if (locale && !url.pathname.startsWith(`/${locale}`)) {
      url.pathname = `/${locale}${url.pathname}`;
    }
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Admin gating: admins MUST have 2FA enrolled.
  // If user is admin and has no MFA factor enrolled, force them to set it up.
  if (isAdminRoute) {
    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    const hasTotp = (factorsData?.totp ?? []).length > 0;

    if (!hasTotp) {
      // Check role from profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin" && !isSecuritySettings) {
        return NextResponse.redirect(
          buildLocalizedUrl(request, locale, "/dashboard/settings/security", {
            force: "true",
          })
        );
      }
    }
  }

  return supabaseResponse;
}
