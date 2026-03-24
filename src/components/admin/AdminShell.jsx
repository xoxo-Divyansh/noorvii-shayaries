import Link from "next/link";

import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import {
  getAdminNavigation,
  getAdminRoleLabel,
} from "@/lib/admin/permissions";

export default function AdminShell({
  session = null,
  title,
  description,
  actions = null,
  children,
}) {
  const navItems = getAdminNavigation(session?.role);
  const roleLabel = session?.role ? getAdminRoleLabel(session.role) : null;

  return (
    <main className="min-h-screen px-4 py-5 sm:px-5 md:px-6">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 pb-10 pt-2">
        <header className="paper-panel-strong rounded-[2.2rem] px-5 py-5 shadow-[0_24px_80px_rgba(124,82,60,0.12)] md:px-7 md:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full bg-[#fff4eb] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#8b5d4a]">
                  Noorvi Admin
                </div>
                {roleLabel ? (
                  <div className="inline-flex rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                    {roleLabel}
                  </div>
                ) : null}
              </div>
              <div className="space-y-2">
                <h1 className="font-[var(--font-playfair)] text-3xl text-[var(--foreground)] md:text-5xl">
                  {title}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-[var(--muted)] md:text-base">
                  {description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-[var(--border)] bg-white/75 px-4 py-2 text-sm font-medium text-[var(--foreground)]"
                >
                  {item.label}
                </Link>
              ))}
              {actions}
              <AdminLogoutButton />
            </div>
          </div>
        </header>

        {children}
      </div>
    </main>
  );
}
