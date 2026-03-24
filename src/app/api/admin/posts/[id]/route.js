import { NextResponse } from "next/server";

import {
  ADMIN_PERMISSIONS,
} from "@/lib/admin/permissions";
import {
  authorizeAdminRequest,
} from "@/lib/admin/auth";
import { revalidatePublicContent } from "@/lib/admin/revalidate";
import {
  deleteAdminPost,
  getAdminPostById,
  updateAdminPost,
} from "@/lib/content/admin-repository";

function createErrorResponse(error, status = 400) {
  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "Unable to process the admin post request.",
    },
    { status }
  );
}

export async function GET(request, context) {
  const { response } = authorizeAdminRequest(request, ADMIN_PERMISSIONS.MANAGE_POSTS);

  if (response) {
    return response;
  }

  const { id } = await context.params;

  try {
    const post = await getAdminPostById(id);

    if (!post) {
      return createErrorResponse(new Error("Post not found."), 404);
    }

    return NextResponse.json({ post });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function PUT(request, context) {
  const { response, session } = authorizeAdminRequest(
    request,
    ADMIN_PERMISSIONS.MANAGE_POSTS
  );

  if (response) {
    return response;
  }

  const { id } = await context.params;

  try {
    const existingPost = await getAdminPostById(id);

    if (!existingPost) {
      return createErrorResponse(new Error("Post not found."), 404);
    }

    const body = await request.json();
    const post = await updateAdminPost(id, body, session);
    revalidatePublicContent([existingPost.mood, post.mood]);
    return NextResponse.json({ post });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function DELETE(request, context) {
  const { response } = authorizeAdminRequest(request, ADMIN_PERMISSIONS.DELETE_POSTS);

  if (response) {
    return response;
  }

  const { id } = await context.params;

  try {
    const deletedPost = await deleteAdminPost(id);
    revalidatePublicContent([deletedPost.mood]);
    return NextResponse.json({ deletedPost });
  } catch (error) {
    return createErrorResponse(error);
  }
}
