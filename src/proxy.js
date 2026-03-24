import { NextResponse } from "next/server";

import {
  ADMIN_PERMISSIONS,
  getRequiredAdminPermission,
  hasAdminPermission,
} from "./lib/admin/permissions";
import { ADMIN_COOKIE_NAME, readAdminSessionValue } from "./lib/admin/session";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const isLogoutApi = pathname === "/api/admin/logout";

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (isLoginPage || isLoginApi || isLogoutApi) {
    return NextResponse.next();
  }

  const session = readAdminSessionValue(request.cookies.get(ADMIN_COOKIE_NAME)?.value);

  if (!session) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const requiredPermission = getRequiredAdminPermission(pathname, request.method);

  if (
    requiredPermission &&
    !hasAdminPermission(session.role, requiredPermission)
  ) {
    if (isAdminApi) {
      const status = requiredPermission === ADMIN_PERMISSIONS.VIEW_DASHBOARD ? 401 : 403;
      return NextResponse.json(
        { error: status === 401 ? "Unauthorized" : "Forbidden" },
        { status }
      );
    }

    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
