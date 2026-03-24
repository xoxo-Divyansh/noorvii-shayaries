import AdminShell from "@/components/admin/AdminShell";
import SocialLinksEditor from "@/components/admin/SocialLinksEditor";
import { requireAdminPageAccess } from "@/lib/admin/auth";
import { ADMIN_PERMISSIONS } from "@/lib/admin/permissions";
import { getAdminSocialLinks } from "@/lib/content/admin-repository";

export default async function AdminSocialsPage() {
  const session = await requireAdminPageAccess(ADMIN_PERMISSIONS.MANAGE_SOCIALS);
  const socialLinks = await getAdminSocialLinks();

  return (
    <AdminShell
      session={session}
      title="Manage Social Links"
      description="Update the platform label, URL, and icon path for the homepage social buttons without opening the database manually."
    >
      <SocialLinksEditor socialLinks={socialLinks} />
    </AdminShell>
  );
}
