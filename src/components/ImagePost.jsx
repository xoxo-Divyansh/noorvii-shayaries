"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function ImagePost({
  image,
  text,
  audioSrc,
  downloadHref,
  downloadLabel,
  isActive,
  audioEnabled,
  isMuted,
  mood,
  title,
}) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    if (isActive && audioEnabled && !isMuted) {
      audio
        .play()
        .then(() => {})
        .catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isActive, audioEnabled, isMuted, audioSrc]);

  return (
    <article className="relative flex min-h-[66vh] w-full items-center justify-center overflow-hidden rounded-[2.4rem] bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-6 md:min-h-[70vh] md:p-8">
      {/* Phone mockup container */}
      <div className="relative w-full max-w-[420px] md:max-w-[480px]">
        {/* Phone frame */}
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[2.5rem] border-[6px] border-[#0a0a0a] bg-black shadow-[0_0_0_2px_#3a3a3a,0_20px_60px_rgba(0,0,0,0.6)]">
          {/* Notch */}
          <div className="absolute left-1/2 top-0 z-30 h-7 w-40 -translate-x-1/2 rounded-b-3xl bg-[#0a0a0a]"></div>
          
          {/* Status bar */}
          <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-8 pt-3 text-white">
            <span className="text-xs font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <svg className="h-3.5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h12v2H4V4zm0 4h12v2H4V8zm0 4h12v2H4v-2zm14-8v16h2V4h-2zm2 0h2v16h-2V4z" />
              </svg>
            </div>
          </div>

          {/* Image content */}
          <div className="relative h-full w-full">
            <Image
              src={image}
              alt={title ?? "Status image"}
              fill
              sizes="480px"
              priority={isActive}
              className={`object-cover transition-all duration-700 ${
                isActive ? "scale-100 brightness-100" : "scale-105 brightness-90"
              }`}
            />
            
            {/* Gradient overlays for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
          </div>

          {/* Text overlay */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-6 pb-8">
            <div className="space-y-3">
              {/* Title badge */}
              {title && (
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-md">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-semibold uppercase tracking-wider text-white">
                    {title}
                  </span>
                </div>
              )}
              
              {/* Poetry text */}
              <h1 
                className="font-[var(--font-playfair)] text-xl leading-[1.6] text-white md:text-2xl"
                style={{ 
                  fontStyle: 'italic',
                  fontWeight: 500,
                  textShadow: '0 3px 12px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 0.8)'
                }}
              >
                {text}
              </h1>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between border-t border-white/10 bg-black/40 px-6 py-3 backdrop-blur-md">
            <span className="text-xs font-medium text-white/80">{mood}</span>
            {downloadHref && (
              <a
                href={downloadHref}
                download
                className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Save
              </a>
            )}
          </div>
        </div>

        {/* Download button outside phone */}
        <div className="mt-6 flex justify-center gap-3">
          {downloadHref && (
            <a
              href={downloadHref}
              download
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:scale-105 hover:border-white/30 hover:bg-white/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {downloadLabel ?? "Download Image"}
            </a>
          )}
          {audioSrc && (
            <a
              href={audioSrc}
              download
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:scale-105 hover:border-white/30 hover:bg-white/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              Audio
            </a>
          )}
        </div>
      </div>

      {audioSrc ? (
        <audio ref={audioRef} loop preload="none" muted={isMuted}>
          <source src={audioSrc} type="audio/mpeg" />
        </audio>
      ) : null}
    </article>
  );
}
