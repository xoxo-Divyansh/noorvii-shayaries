"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

function buildInitialState(initialPost, categories) {
  return {
    title: initialPost?.title ?? "",
    type: initialPost?.type ?? "text",
    mood: initialPost?.mood ?? categories[0]?.mood ?? "",
    text: initialPost?.text ?? "",
    image: initialPost?.image ?? "",
    video: initialPost?.video ?? "",
    poster: initialPost?.poster ?? "",
    audio: initialPost?.audio ?? "",
    downloadHref: initialPost?.downloadHref ?? "",
    downloadLabel: initialPost?.downloadLabel ?? "",
    featured: Boolean(initialPost?.featured),
  };
}

export default function AdminPostForm({ categories = [], initialPost = null }) {
  const router = useRouter();
  const isEditMode = Boolean(initialPost?._id);
  const [form, setForm] = useState(() => buildInitialState(initialPost, categories));
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const submitLabel = useMemo(() => {
    if (isPending) {
      return isEditMode ? "Saving..." : "Creating...";
    }

    return isEditMode ? "Save Changes" : "Create Post";
  }, [isEditMode, isPending]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        isEditMode ? `/api/admin/posts/${initialPost._id}` : "/api/admin/posts",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Could not save this post.");
      }

      startTransition(() => {
        router.push("/admin/posts");
        router.refresh();
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save this post.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="paper-panel-strong rounded-[2rem] px-5 py-6 shadow-[0_24px_80px_rgba(124,82,60,0.12)] md:px-7 md:py-7">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Title</label>
          <input
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="w-full rounded-[1.1rem] border border-[var(--border)] bg-white/88 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]"
            placeholder="Moonlit Letter"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Post type</label>
          <select
            value={form.type}
            onChange={(event) => updateField("type", event.target.value)}
            className="w-full rounded-[1.1rem] border border-[var(--border)] bg-white/88 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]"
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Category</label>
          <select
            value={form.mood}
            onChange={(event) => updateField("mood", event.target.value)}
            className="w-full rounded-[1.1rem] border border-[var(--border)] bg-white/88 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]"
          >
            {categories.map((category) => (
              <option key={category.mood} value={category.mood}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Post text</label>
          <textarea
            value={form.text}
            onChange={(event) => updateField("text", event.target.value)}
            rows={5}
            className="w-full rounded-[1.2rem] border border-[var(--border)] bg-white/88 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]"
            placeholder="Write the caption or shayari text here"
            required
          />
        </div>

        {form.type === "image" ? (
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-[var(--foreground)]">Image path</label>
            <input
              value={form.image}
              onChange={(event) => updateField("image", event.target.value)}
              className="w-full rounded-[1.1rem] border border-[var(--border)] bg-white/88 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]"
              placeholder="/images/love/story-01.webp"
              required={form.type === "image"}
            />
          </div>
        ) : null}

        {form.type === "video" ? (
          <>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-[var(--foreground)]">Video path</label>
              <input
                value={form.video}
                onChange={(event) => updateField("video", event.target.value)}
                className="w-full rounded-[1.1rem] border border-[var(--border)] bg-white/88 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]"
                placeholder="/videos/noorvi/reel-01.mp4"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-[var(--foreground)]">Poster path</label>
              <input
                value={form.poster}
                onChange={(event) => updateField("poster", event.target.value)}
                className="w-full rounded-[1.1rem] border border-[var(--border)] bg-white/88 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]"
                placeholder="/images/video/poster-01.webp"
                required={form.type === "video" && !form.video}
              />
            </div>
          </>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Audio path</label>
          <input
            value={form.audio}
            onChange={(event) => updateField("audio", event.target.value)}
            className="w-full rounded-[1.1rem] border border-[var(--border)] bg-white/88 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]"
            placeholder="/audio/love/theme.mp3"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Download path</label>
          <input
            value={form.downloadHref}
            onChange={(event) => updateField("downloadHref", event.target.value)}
            className="w-full rounded-[1.1rem] border border-[var(--border)] bg-white/88 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]"
            placeholder="/downloads/love/story-01.webp"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Download label</label>
          <input
            value={form.downloadLabel}
            onChange={(event) => updateField("downloadLabel", event.target.value)}
            className="w-full rounded-[1.1rem] border border-[var(--border)] bg-white/88 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[#8b5d4a]"
            placeholder="Download poster"
          />
        </div>

        <label className="mt-8 flex items-center gap-3 text-sm font-medium text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => updateField("featured", event.target.checked)}
            className="h-4 w-4 rounded border-[var(--border)]"
          />
          Mark as featured
        </label>
      </div>

      {initialPost?.id ? (
        <p className="mt-5 text-sm text-[var(--muted)]">Stable post id: {initialPost.id}</p>
      ) : null}

      {error ? <p className="mt-5 text-sm text-[#a24d4d]">{error}</p> : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[#3c2c24] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitLabel}
        </button>
        <Link
          href="/admin/posts"
          className="rounded-full border border-[var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--foreground)]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}