import Link from "next/link";

export const metadata = {
  title: "Series | Noorvi Poetry & Moments",
  description: "Placeholder page for future multi-part shayari collections.",
};

export default function SeriesPage() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-6">
      <div className="paper-panel-strong mx-auto flex max-w-3xl flex-col gap-5 rounded-[2rem] px-6 py-10 text-center shadow-[0_24px_80px_rgba(124,82,60,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
          Coming Soon
        </p>
        <h1 className="font-[var(--font-playfair)] text-4xl text-[var(--foreground)]">
          Series will live here next.
        </h1>
        <p className="text-sm leading-7 text-[var(--muted)]">
          This route was empty before. It now has a safe placeholder until a multi-part poetry
          collection is designed.
        </p>
        <Link
          href="/"
          className="mx-auto rounded-full bg-[#3c2c24] px-5 py-3 text-sm font-semibold text-white"
        >
          Back Home
        </Link>
      </div>
    </main>
  );
}
