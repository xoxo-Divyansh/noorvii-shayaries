"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function CategoryCard({ category }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: category.name,
    title: category.title,
    description: category.description,
    icon: category.icon,
    previewImage: category.previewImage,
    accent: category.accent,
    surface: category.surface,
    shadow: category.shadow,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/categories/${category.mood}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Could not update this category.");
      }

      setMessage("Saved.");
      startTransition(() => {
        router.refresh();
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not update this category.");
    }
  };

  return (
    <form onSubmit={handleSave} className="paper-panel rounded-[2rem] px-5 py-5 shadow-[0_20px_55px_rgba(124,82,60,0.12)] md:px-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span
          className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]"
          style={{ backgroundColor: form.surface || category.surface, color: form.accent || category.accent }}
        >
          {category.mood}
        </span>
        <span className="text-sm text-[var(--muted)]">Public route: /category/{category.mood}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Name</label>
          <input value={form.name} onChange={(event) => updateField("name", event.target.value)} className="w-full rounded-[1rem] border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Title</label>
          <input value={form.title} onChange={(event) => updateField("title", event.target.value)} className="w-full rounded-[1rem] border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Description</label>
          <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} rows={3} className="w-full rounded-[1rem] border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Icon path</label>
          <input value={form.icon} onChange={(event) => updateField("icon", event.target.value)} className="w-full rounded-[1rem] border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Preview image</label>
          <input value={form.previewImage} onChange={(event) => updateField("previewImage", event.target.value)} className="w-full rounded-[1rem] border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Accent color</label>
          <input value={form.accent} onChange={(event) => updateField("accent", event.target.value)} className="w-full rounded-[1rem] border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Surface color</label>
          <input value={form.surface} onChange={(event) => updateField("surface", event.target.value)} className="w-full rounded-[1rem] border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Shadow token</label>
          <input value={form.shadow} onChange={(event) => updateField("shadow", event.target.value)} className="w-full rounded-[1rem] border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={isPending} className="rounded-full bg-[#3c2c24] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
          {isPending ? "Saving..." : "Save Category"}
        </button>
        {message ? <p className="text-sm text-[#4c7b56]">{message}</p> : null}
        {error ? <p className="text-sm text-[#a24d4d]">{error}</p> : null}
      </div>
    </form>
  );
}

export default function CategoriesEditor({ categories = [] }) {
  return (
    <div className="grid gap-5">
      {categories.map((category) => (
        <CategoryCard key={category.mood} category={category} />
      ))}
    </div>
  );
}