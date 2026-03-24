"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function DeletePostButton({ postId, postTitle }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete \"${postTitle}\"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Could not delete this post.");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete this post.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-full border border-[#c99292] bg-[#fff3f3] px-4 py-2 text-sm font-semibold text-[#8a4848] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>
      {error ? <p className="text-sm text-[#a24d4d]">{error}</p> : null}
    </div>
  );
}