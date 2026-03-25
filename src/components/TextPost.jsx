"use client";
import { useEffect, useRef } from "react";

export default function TextPost({
  text,
  audioSrc,
  downloadHref,
  isActive,
  audioEnabled,
  isMuted,
  mood,
  title,
}) {
  const audioRef = useRef(null);
  const moodGlow = {
    rain: "bg-[#6B95C8]/30",
    love: "bg-[#C86B88]/30",
    joy: "bg-[#D5A33B]/30",
    "deep-thoughts": "bg-[#8571B8]/30",
    "video-shayari": "bg-[#4D9C83]/30",
  };
  const glowClass = moodGlow[mood] ?? "bg-[#8B2F2F]/30";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    audio.muted = isMuted;

    if (isActive && audioEnabled && !isMuted) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isActive, audioEnabled, isMuted, audioSrc]);

  return (
    <article className="relative flex min-h-[66vh] items-center justify-center overflow-hidden rounded-[2.4rem] bg-gradient-to-br from-[#fef9f5] via-[#fdf5ed] to-[#fcf1e5] px-6 py-8 md:min-h-[70vh] md:px-8">
      <div className={`absolute top-1/4 left-1/4 h-[280px] w-[280px] rounded-full ${glowClass} blur-[90px]`}></div>
      <div className={`absolute bottom-1/3 right-1/3 h-[220px] w-[220px] rounded-full ${glowClass} blur-[80px]`}></div>
      <div className="absolute top-6 left-6 h-14 w-14 border-l-2 border-t-2 border-[#6B1F1F]/30 rounded-tl-3xl md:top-8 md:left-8 md:h-16 md:w-16"></div>
      <div className="absolute top-6 right-6 h-14 w-14 border-r-2 border-t-2 border-[#6B1F1F]/30 rounded-tr-3xl md:top-8 md:right-8 md:h-16 md:w-16"></div>
      <div className="absolute bottom-6 left-6 h-14 w-14 border-l-2 border-b-2 border-[#6B1F1F]/30 rounded-bl-3xl md:bottom-8 md:left-8 md:h-16 md:w-16"></div>
      <div className="absolute bottom-6 right-6 h-14 w-14 border-r-2 border-b-2 border-[#6B1F1F]/30 rounded-br-3xl md:bottom-8 md:right-8 md:h-16 md:w-16"></div>
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center justify-center space-y-6 px-6 py-10 md:max-w-3xl md:px-10 md:py-12">
        {title && (
          <div className="inline-flex items-center gap-2.5 rounded-full border-2 border-[#6B1F1F] bg-[#fef9f5] px-6 py-2.5 shadow-lg">
            <svg className="h-3.5 w-3.5 text-[#6B1F1F]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-[var(--font-playfair)] text-sm font-semibold italic tracking-[0.12em] text-[#6B1F1F]">{title}</span>
          </div>
        )}
        <div className="w-full text-center">
          <p className="font-[var(--font-playfair)] text-[1.85rem] leading-[1.8] text-[#3a0f0f] md:text-[2.5rem] md:leading-[1.9]" style={{ fontStyle: 'italic', fontWeight: 600, letterSpacing: '0.025em', textShadow: '0 2px 6px rgba(58, 15, 15, 0.25)' }}>{text}</p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#6B1F1F]/50"></div>
          <svg className="h-4 w-4 text-[#6B1F1F]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#6B1F1F]/50"></div>
        </div>
        <div className="text-center">
          <span className="font-[var(--font-playfair)] text-sm font-medium italic tracking-wider text-[#6B1F1F]">{mood}</span>
        </div>
        {downloadHref && (
          <a href={downloadHref} download className="group mt-3 inline-flex items-center gap-2.5 rounded-full border-2 border-[#6B1F1F] bg-gradient-to-r from-[#4A1515] to-[#6B1F1F] px-7 py-3 text-sm font-semibold tracking-wide text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Audio
          </a>
        )}
      </div>
      {audioSrc && (<audio ref={audioRef} loop preload="metadata"><source src={audioSrc} type="audio/mpeg" /></audio>)}
    </article>
  );
}