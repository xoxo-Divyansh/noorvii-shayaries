import { NextResponse } from "next/server";

import {
  ADMIN_PERMISSIONS,
} from "@/lib/admin/permissions";
import {
  authorizeAdminRequest,
} from "@/lib/admin/auth";
import { getAdminSocialLinks } from "@/lib/content/admin-repository";

function createErrorResponse(error) {
  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "Unable to load social links.",
    },
    { status: 400 }
  );
}

export async function GET(request) {
  const { response } = authorizeAdminRequest(
    request,
    ADMIN_PERMISSIONS.MANAGE_SOCIALS
  );

  if (response) {
    return response;
  }

  try {
    const socialLinks = await getAdminSocialLinks();
    return NextResponse.json({ socialLinks });
  } catch (error) {
    return createErrorResponse(error);
  }
}
