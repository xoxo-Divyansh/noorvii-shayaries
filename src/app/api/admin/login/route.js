import { NextResponse } from "next/server";

import {
  clearAdminSessionCookie,
  createAdminSessionCookie,
  hasAdminAuthConfig,
} from "@/lib/admin/auth";
import { verifyAdminPassword } from "@/lib/admin/passwords";
import { findAdminUserByEmail } from "@/lib/admin/users";

export async function POST(request) {
  if (!hasAdminAuthConfig()) {
    return NextResponse.json(
      {
        error:
          "Admin auth is not configured. Add MONGODB_URI and ADMIN_SESSION_SECRET, then create at least one admin user.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const user = await findAdminUserByEmail(email);
    const isPasswordValid = user
      ? await verifyAdminPassword(password, user.password)
      : false;

    if (!user || !user.role || !isPasswordValid) {
      const response = NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
      response.cookies.set(clearAdminSessionCookie());
      return response;
    }

    const response = NextResponse.json({
      success: true,
      role: user.role,
    });

    response.cookies.set(
      createAdminSessionCookie({
        userId: user._id,
        role: user.role,
      })
    );

    return response;
  } catch {
    return NextResponse.json(
      { error: "Could not process login right now." },
      { status: 500 }
    );
  }
}
