import "server-only";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_PERMISSIONS,
  hasAdminPermission,
} from "@/lib/admin/permissions";
import { isDatabaseConfigured } from "@/lib/db/mongodb";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionValue,
  hasAdminSessionSecret,
  readAdminSessionValue,
} from "@/lib/admin/session";

export function hasAdminAuthConfig() {
  return Boolean(hasAdminSessionSecret() && isDatabaseConfigured());
}

export function createAdminSessionCookie(session) {
  return {
    name: ADMIN_COOKIE_NAME,
    value: createAdminSessionValue(session),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  };
}

export function clearAdminSessionCookie() {
  return {
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export async function getAdminSession() {
  if (!hasAdminAuthConfig()) {
    return null;
  }

  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  return readAdminSessionValue(sessionValue);
}

export async function isAdminAuthenticated() {
  return Boolean(await getAdminSession());
}

export async function requireAdminPageAccess(
  permission = ADMIN_PERMISSIONS.VIEW_DASHBOARD
) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  if (permission && !hasAdminPermission(session.role, permission)) {
    redirect("/admin");
  }

  return session;
}

export function getAdminRequestSession(request) {
  if (!hasAdminAuthConfig()) {
    return null;
  }

  return readAdminSessionValue(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

export function createAdminUnauthorizedResponse() {
  if (!hasAdminAuthConfig()) {
    return NextResponse.json(
      {
        error:
          "Admin auth is not configured. Add MONGODB_URI and ADMIN_SESSION_SECRET, then create at least one admin user.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function createAdminForbiddenResponse() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export function authorizeAdminRequest(
  request,
  permission = ADMIN_PERMISSIONS.VIEW_DASHBOARD
) {
  if (!hasAdminAuthConfig()) {
    return {
      session: null,
      response: createAdminUnauthorizedResponse(),
    };
  }

  const session = getAdminRequestSession(request);

  if (!session) {
    return {
      session: null,
      response: createAdminUnauthorizedResponse(),
    };
  }

  if (permission && !hasAdminPermission(session.role, permission)) {
    return {
      session,
      response: createAdminForbiddenResponse(),
    };
  }

  return {
    session,
    response: null,
  };
}

export function isAdminRequestAuthorized(
  request,
  permission = ADMIN_PERMISSIONS.VIEW_DASHBOARD
) {
  const session = getAdminRequestSession(request);

  if (!session) {
    return false;
  }

  return permission ? hasAdminPermission(session.role, permission) : true;
}
