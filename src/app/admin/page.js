import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
import { requireAdminPageAccess } from "@/lib/admin/auth";
import {
  ADMIN_PERMISSIONS,
  hasAdminPermission,
} from "@/lib/admin/permissions";
import {
  getAdminCategories,
  getAdminPosts,
  getAdminSocialLinks,
} from "@/lib/content/admin-repository";

export default async function AdminOverviewPage() {
  const session = await requireAdminPageAccess();
  const canManageCategories = hasAdminPermission(
    session.role,
    ADMIN_PERMISSIONS.MANAGE_CATEGORIES
  );
  const canManageSocials = hasAdminPermission(
    session.role,
    ADMIN_PERMISSIONS.MANAGE_SOCIALS
  );

  const [posts, categories, socialLinks] = await Promise.all([
    getAdminPosts(),
    canManageCategories ? getAdminCategories() : Promise.resolve([]),
    canManageSocials ? getAdminSocialLinks() : Promise.resolve([]),
  ]);

  const sections = [
    {
      href: "/admin/posts",
      label: "Posts",
      description: "Create and update your shayari, stories, and media",
      value: posts.length,
    },
    canManageSocials
      ? {
          href: "/admin/socials",
          label: "Social Links",
          description: "Update Instagram, X, and other social connections",
          value: socialLinks.length,
        }
      : null,
    canManageCategories
      ? {
          href: "/admin/categories",
          label: "Categories",
          description: "Manage category names, descriptions, and colors",
          value: categories.length,
        }
      : null,
  ].filter(Boolean);

  const quickStartSteps = canManageCategories
    ? [
        "Create or update a post in the posts section",
        "Adjust categories or social links if needed",
        "Refresh your website to see the changes live",
      ]
    : [
        "Create or update a post in the posts section",
        "Review your text and media before saving",
        "Contact a super admin for deletions or category changes",
      ];

  const dashboardDescription = canManageCategories
    ? "Manage all content, categories, and settings from here. Every change appears instantly on your website."
    : "Create and update your daily posts here. Contact a super admin for category changes and other settings.";

  return (
    <AdminShell
      session={session}
      title="Content Dashboard"
      description={dashboardDescription}
    >
      <section className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="paper-panel-strong rounded-[2rem] px-5 py-5 shadow-[0_24px_80px_rgba(124,82,60,0.12)] transition hover:-translate-y-0.5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              {section.label}
            </p>
            <p className="mt-3 font-[var(--font-playfair)] text-4xl text-[var(--foreground)]">
              {section.value}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{section.description}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_340px]">
        <article className="paper-panel rounded-[2rem] px-5 py-6 shadow-[0_24px_80px_rgba(124,82,60,0.12)] md:px-7">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
            Recent Posts
          </p>
          <div className="mt-4 grid gap-3">
            {posts.length ? (
              posts.slice(0, 4).map((post) => (
                <div key={post._id} className="rounded-[1.5rem] border border-white/60 bg-white/72 px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-[var(--font-playfair)] text-2xl text-[var(--foreground)]">
                        {post.title}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {post.mood} / {post.type}
                      </p>
                    </div>
                    <Link href={`/admin/posts/${post._id}`} className="rounded-full bg-[#3c2c24] px-4 py-2 text-sm font-semibold text-white">
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-white/60 bg-white/72 px-4 py-4 text-sm leading-7 text-[var(--muted)]">
                No posts yet. Create your first post from the posts section.
              </div>
            )}
          </div>
        </article>

        <article className="paper-panel-strong rounded-[2rem] px-5 py-6 shadow-[0_24px_80px_rgba(124,82,60,0.12)] md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
            Quick Start
          </p>
          <ol className="mt-4 grid gap-3 text-sm leading-7 text-[var(--muted)]">
            {quickStartSteps.map((step, index) => (
              <li key={step} className="rounded-[1.4rem] border border-white/60 bg-white/72 px-4 py-4">
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </article>
      </section>
    </AdminShell>
  );
}
