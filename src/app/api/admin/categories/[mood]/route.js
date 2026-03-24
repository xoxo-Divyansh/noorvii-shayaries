import { NextResponse } from "next/server";

import {
  ADMIN_PERMISSIONS,
} from "@/lib/admin/permissions";
import {
  authorizeAdminRequest,
} from "@/lib/admin/auth";
import { revalidatePublicContent } from "@/lib/admin/revalidate";
import { updateAdminCategory } from "@/lib/content/admin-repository";

function createErrorResponse(error, status = 400) {
  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "Unable to update the category.",
    },
    { status }
  );
}

export async function PUT(request, context) {
  const { response } = authorizeAdminRequest(
    request,
    ADMIN_PERMISSIONS.MANAGE_CATEGORIES
  );

  if (response) {
    return response;
  }

  const { mood } = await context.params;

  try {
    const body = await request.json();
    const category = await updateAdminCategory(mood, body);
    revalidatePublicContent([category.mood]);
    return NextResponse.json({ category });
  } catch (error) {
    return createErrorResponse(error);
  }
}
