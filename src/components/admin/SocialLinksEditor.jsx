"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function SocialLinkRow({ link }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: link.name,
    href: link.href,
    icon: link.icon,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/socials/${link.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Could not update this social link.");
      }

      setMessage("Saved.");
      startTransition(() => {
        router.refresh();
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not update this social link.");
    }
  };

  return (
    <form onSubmit={handleSave} className="rounded-[1.8rem] border border-white/60 bg-white/72 p-5 shadow-[0_18px_50px_rgba(124,82,60,0.08)]">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Platform</label>
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-[1rem] border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-[var(--foreground)]">URL</label>
          <input
            value={form.href}
            onChange={(event) => setForm((current) => ({ ...current, href: event.target.value }))}
            className="w-full rounded-[1rem] border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Icon path</label>
          <input
            value={form.icon}
            onChange={(event) => setForm((current) => ({ ...current, icon: event.target.value }))}
            className="w-full rounded-[1rem] border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-[#3c2c24] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save Link"}
          </button>
        </div>
      </div>

      {message ? <p className="mt-3 text-sm text-[#4c7b56]">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-[#a24d4d]">{error}</p> : null}
    </form>
  );
}

export default function SocialLinksEditor({ socialLinks = [] }) {
  return (
    <div className="grid gap-4">
      {socialLinks.map((link) => (
        <SocialLinkRow key={link.id} link={link} />
      ))}
    </div>
  );
}