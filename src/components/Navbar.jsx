import Image from "next/image";
import Link from "next/link";

export default function Navbar({ socialLinks = [] }) {
  return (
    <header className="paper-panel-strong mx-auto flex w-full max-w-[1180px] items-center justify-between rounded-full px-5 py-3 shadow-[0_18px_55px_rgba(124,82,60,0.12)] md:px-6">
      <Link href="/" className="flex items-center gap-3">
        <span className="rounded-full bg-[#fff4eb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-[#8b5d4a]">
          Noorvi
        </span>
        <span className="hidden text-sm text-[var(--muted)] md:inline">
          Poetry and moments
        </span>
      </Link>

      <div className="flex items-center gap-2">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.name}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/70 hover:-translate-y-0.5"
          >
            <Image src={link.icon} alt="" width={22} height={22} />
          </a>
        ))}
      </div>
    </header>
  );
}
