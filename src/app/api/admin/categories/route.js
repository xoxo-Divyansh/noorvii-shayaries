import { NextResponse } from "next/server";

import {
  ADMIN_PERMISSIONS,
} from "@/lib/admin/permissions";
import {
  authorizeAdminRequest,
} from "@/lib/admin/auth";
import { getAdminCategories } from "@/lib/content/admin-repository";

function createErrorResponse(error) {
  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "Unable to load categories.",
    },
    { status: 400 }
  );
}

export async function GET(request) {
  const { response } = authorizeAdminRequest(
    request,
    ADMIN_PERMISSIONS.MANAGE_CATEGORIES
  );

  if (response) {
    return response;
  }

  try {
    const categories = await getAdminCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    return createErrorResponse(error);
  }
}
