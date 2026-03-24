import { NextResponse } from "next/server";

import {
  ADMIN_PERMISSIONS,
} from "@/lib/admin/permissions";
import {
  authorizeAdminRequest,
} from "@/lib/admin/auth";
import { revalidatePublicContent } from "@/lib/admin/revalidate";
import { updateAdminSocialLink } from "@/lib/content/admin-repository";

function createErrorResponse(error, status = 400) {
  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "Unable to update the social link.",
    },
    { status }
  );
}

export async function PUT(request, context) {
  const { response } = authorizeAdminRequest(
    request,
    ADMIN_PERMISSIONS.MANAGE_SOCIALS
  );

  if (response) {
    return response;
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const socialLink = await updateAdminSocialLink(id, body);
    revalidatePublicContent();
    return NextResponse.json({ socialLink });
  } catch (error) {
    return createErrorResponse(error);
  }
}
