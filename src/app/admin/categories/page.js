import AdminShell from "@/components/admin/AdminShell";
import CategoriesEditor from "@/components/admin/CategoriesEditor";
import { requireAdminPageAccess } from "@/lib/admin/auth";
import { ADMIN_PERMISSIONS } from "@/lib/admin/permissions";
import { getAdminCategories } from "@/lib/content/admin-repository";

export default async function AdminCategoriesPage() {
  const session = await requireAdminPageAccess(ADMIN_PERMISSIONS.MANAGE_CATEGORIES);
  const categories = await getAdminCategories();

  return (
    <AdminShell
      session={session}
      title="Category Settings"
      description="Fine-tune mood names, descriptions, icons, preview paths, and palette tokens while keeping the public route slug stable."
    >
      <CategoriesEditor categories={categories} />
    </AdminShell>
  );
}
