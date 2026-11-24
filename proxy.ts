import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";

/**
 * Next.js 16 proxy (middleware equivalent).
 * - Admin auth guard
 * - Locale redirects for localized public pages → /{locale}/…
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Admin auth ---
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      const token = request.cookies.get(AUTH_COOKIE)?.value;
      if (token) {
        const session = await verifyToken(token);
        if (session) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }
      return NextResponse.next();
    }

    const token = request.cookies.get(AUTH_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const session = await verifyToken(token);
    if (!session) {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url),
      );
      response.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
      return response;
    }

    return NextResponse.next();
  }

  // --- Locale: redirect bare localized roots to default locale ---
  // Keep /solutions/construction as the existing special client page.
  if (pathname === "/" || pathname === "") {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}`;
    return NextResponse.redirect(url);
  }

  if (pathname === "/contact" || pathname === "/contact/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}/contact`;
    return NextResponse.redirect(url);
  }

  if (pathname === "/services" || pathname === "/services/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}/services`;
    return NextResponse.redirect(url);
  }

  if (pathname === "/solutions" || pathname === "/solutions/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}/solutions`;
    return NextResponse.redirect(url);
  }

  if (
    pathname.startsWith("/solutions/") &&
    pathname !== "/solutions/construction" &&
    !pathname.startsWith("/solutions/construction/")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(url);
  }

  // Valid locale prefix → persist cookie
  const first = pathname.split("/")[1];
  if (first && isLocale(first)) {
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", first, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/contact",
    "/contact/:path*",
    "/services",
    "/services/:path*",
    "/admin/:path*",
    "/solutions",
    "/solutions/:path*",
    "/:locale",
    "/:locale/contact",
    "/:locale/contact/:path*",
    "/:locale/services",
    "/:locale/services/:path*",
    "/:locale/solutions",
    "/:locale/solutions/:path*",
  ],
};
