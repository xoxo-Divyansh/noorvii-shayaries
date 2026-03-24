import { NextResponse } from "next/server";

import {
  ADMIN_PERMISSIONS,
} from "@/lib/admin/permissions";
import {
  authorizeAdminRequest,
} from "@/lib/admin/auth";
import { revalidatePublicContent } from "@/lib/admin/revalidate";
import {
  createAdminPost,
  getAdminPosts,
} from "@/lib/content/admin-repository";

function createErrorResponse(error) {
  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "Unable to process the admin posts request.",
    },
    { status: 400 }
  );
}

export async function GET(request) {
  const { response } = authorizeAdminRequest(request, ADMIN_PERMISSIONS.MANAGE_POSTS);

  if (response) {
    return response;
  }

  try {
    const posts = await getAdminPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function POST(request) {
  const { response, session } = authorizeAdminRequest(
    request,
    ADMIN_PERMISSIONS.MANAGE_POSTS
  );

  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const post = await createAdminPost(body, session);
    revalidatePublicContent([post.mood]);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
