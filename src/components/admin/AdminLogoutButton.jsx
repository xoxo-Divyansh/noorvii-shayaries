"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    setError("");

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Could not log out right now.");
      }

      startTransition(() => {
        router.replace("/admin/login");
        router.refresh();
      });
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : "Could not log out.");
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        className="rounded-full bg-[#3c2c24] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing out..." : "Sign Out"}
      </button>
      {error ? <p className="text-sm text-[#a24d4d]">{error}</p> : null}
    </div>
  );
}