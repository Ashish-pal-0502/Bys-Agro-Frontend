import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;

  const protectedRoutes = ["/checkout", "/orders", "/profile"];
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/", request.url);
    // loginUrl.searchParams.set("login", "true");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/profile/:path*"],
};
