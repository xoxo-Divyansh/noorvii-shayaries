import Link from "next/link";

import AdminShell from "@/components/admin/AdminShell";
import DeletePostButton from "@/components/admin/DeletePostButton";
import { requireAdminPageAccess } from "@/lib/admin/auth";
import {
  ADMIN_PERMISSIONS,
  hasAdminPermission,
} from "@/lib/admin/permissions";
import { getAdminPosts } from "@/lib/content/admin-repository";

export default async function AdminPostsPage() {
  const session = await requireAdminPageAccess(ADMIN_PERMISSIONS.MANAGE_POSTS);
  const posts = await getAdminPosts();
  const canDeletePosts = hasAdminPermission(session.role, ADMIN_PERMISSIONS.DELETE_POSTS);

  return (
    <AdminShell
      session={session}
      title="Manage Posts"
      description={
        canDeletePosts
          ? "Create and update your shayari, stories, and media posts from here."
          : "Create and update posts here. Contact a super admin to delete posts."
      }
      actions={
        <Link href="/admin/posts/new" className="rounded-full bg-[#3c2c24] px-5 py-2 text-sm font-semibold text-white">
          New Post
        </Link>
      }
    >
      <section className="grid gap-4">
        {posts.map((post) => (
          <article key={post._id} className="paper-panel-strong rounded-[2rem] px-5 py-5 shadow-[0_24px_80px_rgba(124,82,60,0.12)] md:px-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
                  <span className="rounded-full bg-white/75 px-3 py-1 uppercase tracking-[0.22em]">{post.type}</span>
                  <span>{post.mood}</span>
                  {post.featured ? <span className="rounded-full bg-[#fff4eb] px-3 py-1 text-[#8b5d4a]">Featured</span> : null}
                </div>
                <div>
                  <h2 className="font-[var(--font-playfair)] text-3xl text-[var(--foreground)]">{post.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]">{post.text}</p>
                </div>
                <p className="text-sm text-[var(--muted)]">Stable id: {post.id}</p>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link href={`/admin/posts/${post._id}`} className="rounded-full bg-[#3c2c24] px-5 py-2 text-sm font-semibold text-white">
                  Edit
                </Link>
                {canDeletePosts ? <DeletePostButton postId={post._id} postTitle={post.title} /> : null}
              </div>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
