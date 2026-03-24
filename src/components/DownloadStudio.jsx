import Image from "next/image";
import Link from "next/link";

export default function DownloadStudio({
  featuredDownloads = [],
  featuredImagePost,
  featuredVideoPost,
}) {
  return (
    <section className="grid gap-6 md:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-8">
      <article className="paper-panel-strong rounded-[2.4rem] px-6 py-6 shadow-[0_24px_80px_rgba(124,82,60,0.12)] md:px-7 md:py-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              Preview
            </p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-3xl text-[var(--foreground)]">
              Story-ready designs
            </h2>
          </div>
          <Link
            href="/category/love"
            className="rounded-full border border-[var(--border)] bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
          >
            View Love
          </Link>
        </div>

        <div className="mx-auto flex max-w-xs flex-col gap-4">
          <div className="rounded-[2.4rem] bg-[#3c2c24] p-3 shadow-[0_28px_80px_rgba(60,44,36,0.24)]">
            <div className="rounded-[2rem] bg-[#f5e6db] p-3">
              <div className="relative aspect-[9/18] overflow-hidden rounded-[1.7rem]">
                <Image
                  src={featuredImagePost?.image ?? "/placeholders/love-soft.svg"}
                  alt="Featured Noorvi preview"
                  fill
                  sizes="320px"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(60,44,36,0.8)_100%)] p-5">
                  <p className="text-xs uppercase tracking-[0.26em] text-white/70">Featured</p>
                  <p className="mt-2 font-[var(--font-playfair)] text-2xl leading-tight text-white">
                    {featuredImagePost?.text ?? "Beautiful words for every mood"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <a
              href={featuredImagePost?.image ?? "/placeholders/love-soft.svg"}
              download
              className="rounded-full bg-[#3c2c24] px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Save for Status
            </a>
            <a
              href={
                featuredVideoPost?.downloadHref ??
                featuredVideoPost?.poster ??
                "/placeholders/video-shayari.svg"
              }
              download
              className="rounded-full border border-[var(--border)] bg-white/78 px-5 py-3 text-center text-sm font-semibold text-[var(--foreground)]"
            >
              Download Video
            </a>
          </div>
        </div>
      </article>

      <article className="paper-panel rounded-[2.4rem] px-6 py-6 shadow-[0_24px_80px_rgba(124,82,60,0.12)] md:px-7 md:py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
          Download Options
        </p>
        <h2 className="mt-2 font-[var(--font-playfair)] text-3xl text-[var(--foreground)] md:text-4xl">
          Image, video, and audio — all in one place
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          Choose your preferred format and download. Perfect for stories, reels, or status updates.
        </p>

        <div className="mt-6 grid gap-4">
          {featuredDownloads.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.8rem] border border-white/60 bg-white/72 p-5 shadow-[0_18px_50px_rgba(124,82,60,0.08)]"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <h3 className="font-[var(--font-playfair)] text-2xl text-[var(--foreground)]">
                    {item.label}
                  </h3>
                  <p className="text-sm leading-7 text-[var(--muted)]">{item.description}</p>
                </div>

                {item.href ? (
                  <a
                    href={item.href}
                    download
                    className="inline-flex items-center justify-center rounded-full bg-[#3c2c24] px-5 py-3 text-sm font-semibold text-white"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white/60 px-5 py-3 text-sm font-semibold text-[var(--muted)]">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
