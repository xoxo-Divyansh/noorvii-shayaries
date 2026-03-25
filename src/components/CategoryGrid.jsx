import Image from "next/image";
import Link from "next/link";

export default function CategoryGrid({ categories = [] }) {
  return (
    <section className="paper-panel rounded-[2rem] px-5 py-6 shadow-[0_24px_80px_rgba(124,82,60,0.12)] md:px-8 md:py-8">
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
          Browse by Mood
        </p>
        <h2 className="font-[var(--font-playfair)] text-3xl text-[var(--foreground)] md:text-4xl">
          Choose your vibe, find your words
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {categories.map((cat) => (
          <Link
            key={cat.mood}
            href={`/category/${cat.mood}`}
            className="group rounded-[1.8rem] focus-visible:outline-none"
          >
            <div
              className="animate-glow-pulse flex h-full min-h-60 flex-col justify-between rounded-[1.8rem] border border-white/60 p-5 shadow-[0_20px_55px_rgba(124,82,60,0.12)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_28px_70px_rgba(124,82,60,0.18)]"
              style={{
                background: `linear-gradient(180deg, ${cat.surface} 0%, rgba(255,255,255,0.92) 100%)`,
                boxShadow: `0 20px 55px ${cat.shadow}`,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-white/60 bg-white/65"
                  style={{ boxShadow: `0 14px 40px ${cat.shadow}` }}
                >
                  <Image src={cat.icon} alt="" width={40} height={40} />
                </div>

                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.72)",
                    color: cat.accent,
                  }}
                >
                  Explore
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="font-[var(--font-playfair)] text-2xl text-[var(--foreground)]">
                  {cat.name}
                </h3>
                <p className="text-sm leading-7 text-[var(--muted)]">{cat.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
