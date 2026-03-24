import { notFound } from "next/navigation";

import AdminPostForm from "@/components/admin/AdminPostForm";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdminPageAccess } from "@/lib/admin/auth";
import { ADMIN_PERMISSIONS } from "@/lib/admin/permissions";
import {
  getAdminCategories,
  getAdminPostById,
} from "@/lib/content/admin-repository";

export default async function EditAdminPostPage({ params }) {
  const session = await requireAdminPageAccess(ADMIN_PERMISSIONS.MANAGE_POSTS);

  const { id } = await params;
  const [categories, post] = await Promise.all([
    getAdminCategories(),
    getAdminPostById(id),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <AdminShell
      session={session}
      title="Edit Post"
      description="Update the content that feeds the live story stream. Mood changes will revalidate both the old and the new category pages."
    >
      <AdminPostForm categories={categories} initialPost={post} />
    </AdminShell>
  );
}
