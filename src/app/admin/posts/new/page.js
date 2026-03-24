import AdminPostForm from "@/components/admin/AdminPostForm";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdminPageAccess } from "@/lib/admin/auth";
import { ADMIN_PERMISSIONS } from "@/lib/admin/permissions";
import { getAdminCategories } from "@/lib/content/admin-repository";

export default async function NewAdminPostPage() {
  const session = await requireAdminPageAccess(ADMIN_PERMISSIONS.MANAGE_POSTS);
  const categories = await getAdminCategories();

  return (
    <AdminShell
      session={session}
      title="Create New Post"
      description="Add new shayari or stories here. They'll appear on your website after saving."
    >
      <AdminPostForm categories={categories} />
    </AdminShell>
  );
}
