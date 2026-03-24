"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function AdminLoginForm({ from = "/admin" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Login failed.");
      }

      startTransition(() => {
        router.replace(from || "/admin");
        router.refresh();
      });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="admin-email" className="text-sm font-medium text-[var(--foreground)]">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-[1.2rem] border border-[var(--border)] bg-white/90 px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[#8b5d4a]"
          placeholder="you@example.com"
          autoComplete="username"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="admin-password" className="text-sm font-medium text-[var(--foreground)]">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-[1.2rem] border border-[var(--border)] bg-white/90 px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[#8b5d4a]"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
      </div>

      {error ? <p className="text-sm text-[#a24d4d]">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-[#3c2c24] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Enter Dashboard"}
      </button>
    </form>
  );
}
