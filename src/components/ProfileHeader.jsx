import Image from "next/image";

export default function ProfileHeader() {
  return (
    <section className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(300px,400px)] md:items-center lg:gap-8">
      <div className="paper-panel-strong rounded-[2.2rem] px-6 py-8 shadow-[0_24px_80px_rgba(124,82,60,0.12)] md:px-8 md:py-10">
        <div className="mb-4 inline-flex rounded-full bg-[#fff4eb] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#8b5d4a]">
          Noorvi Poetry and Moments
        </div>
        <h1 className="max-w-[18ch] font-[var(--font-playfair)] text-4xl leading-tighter tracking-tighter text-start text-[var(--foreground)] md:text-[4.5rem]">
          Where words become feelings, and feelings become memories
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)] md:text-base">
          A collection of heartfelt shayari and stories for every mood. Beautiful words for every moment, ready to download and share on your stories.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {["Love", "Rain", "Joy", "Deep Thoughts", "Video Shayari"].map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm text-[var(--foreground)] shadow-[0_10px_25px_rgba(124,82,60,0.08)]"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="animate-float-card paper-panel-strong mx-auto flex w-full max-w-[380px] flex-col items-center rounded-[2.4rem] px-6 py-8 text-center shadow-[0_30px_90px_rgba(124,82,60,0.16)] md:justify-self-center">
        <div className="relative h-36 w-36 overflow-hidden rounded-full border border-white/70 bg-white shadow-[0_18px_40px_rgba(124,82,60,0.12)]">
          <Image
            src="/brand/noorvi-avatar.svg"
            alt="Noorvi portrait illustration"
            fill
            preload
            sizes="144px"
            className="object-cover"
          />
        </div>
        <h2 className="mt-5 font-[var(--font-playfair)] text-3xl text-[var(--foreground)]">
          Noorvi
        </h2>
        <p className="mt-2 text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
          Poetry. Emotions. Stories.
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          Words from the heart, crafted for your soul. Curated shayari collections perfect for reels, stories, and quiet moments.
        </p>
      </div>
    </section>
  );
}
