import Link from "next/link";
import { redirect } from "next/navigation";

import AdminLoginForm from "@/components/admin/AdminLoginForm";
import {
  hasAdminAuthConfig,
  isAdminAuthenticated,
} from "@/lib/admin/auth";
import { getAdminUserCount } from "@/lib/admin/users";

export default async function AdminLoginPage({ searchParams }) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const params = await searchParams;
  const from = typeof params?.from === "string" ? params.from : "/admin";
  const isConfigured = hasAdminAuthConfig();
  let userCount = 0;
  let setupError = "";

  if (isConfigured) {
    try {
      userCount = await getAdminUserCount();
    } catch (error) {
      setupError =
        error instanceof Error ? error.message : "Could not reach the admin users collection.";
    }
  }

  const canShowLoginForm = isConfigured && !setupError && userCount > 0;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-5 md:px-6">
      <div className="mx-auto grid w-full max-w-[980px] gap-6 pt-8 md:grid-cols-[minmax(0,1fr)_380px] md:items-center">
        <section className="paper-panel-strong rounded-[2.2rem] px-6 py-8 shadow-[0_24px_80px_rgba(124,82,60,0.12)] md:px-8 md:py-10">
          <div className="mb-4 inline-flex rounded-full bg-[#fff4eb] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#8b5d4a]">
            Protected Admin Access
          </div>
          <h1 className="max-w-[12ch] font-[var(--font-playfair)] text-4xl leading-tight text-[var(--foreground)] md:text-[4.5rem]">
            Manage your poetry collection with ease
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)] md:text-base">
            Create, edit, and organize your shayari effortlessly. All changes appear instantly on your website.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="rounded-full border border-[var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--foreground)]">
              Back to Website
            </Link>
            <span className="rounded-full bg-white/80 px-5 py-3 text-sm text-[var(--muted)]">
              Secure admin area
            </span>
          </div>
        </section>

        <section className="paper-panel rounded-[2.2rem] px-6 py-7 shadow-[0_24px_80px_rgba(124,82,60,0.12)] md:px-7">
          <h2 className="font-[var(--font-playfair)] text-3xl text-[var(--foreground)]">Admin Login</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Sign in with your email and password
          </p>

          {canShowLoginForm ? (
            <div className="mt-6">
              <AdminLoginForm from={from} />
            </div>
          ) : setupError ? (
            <div className="mt-6 rounded-[1.4rem] border border-[#d9b8a6] bg-[#fff5ef] px-4 py-4 text-sm leading-7 text-[#8a5f4b]">
              {setupError}
            </div>
          ) : isConfigured ? (
            <div className="mt-6 rounded-[1.4rem] border border-[#d9b8a6] bg-[#fff5ef] px-4 py-4 text-sm leading-7 text-[#8a5f4b]">
              अभी तक कोई एडमिन यूजर नहीं बनाया गया है। पहला एडमिन बनाने के लिए टर्मिनल में यह कमांड चलाएं: <code>npm run auth:create-user -- --email you@example.com --password your-password --role admin</code>
            </div>
          ) : (
            <div className="mt-6 rounded-[1.4rem] border border-[#d9b8a6] bg-[#fff5ef] px-4 py-4 text-sm leading-7 text-[#8a5f4b]">
              एडमिन पैनल इस्तेमाल करने से पहले अपनी .env फाइल में <code>MONGODB_URI</code> और <code>ADMIN_SESSION_SECRET</code> जोड़ें।
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
