"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ImagePost from "./ImagePost";
import TextPost from "./TextPost";
import VideoPost from "./VideoPost";

export default function PostContainer({ posts = [], category }) {
  const [activeId, setActiveId] = useState(posts[0]?.id ?? null);
  const [isMuted, setIsMuted] = useState(true);
  const [animatedPosts, setAnimatedPosts] = useState(new Set());
  const containerRef = useRef(null);
  const postRefs = useRef({});
  const ratiosRef = useRef(new Map());
  const audioRefs = useRef({}); // Store refs for all audio elements

  // Control audio playback for active post
  useEffect(() => {
    // Pause all audio first
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    // Play active post audio if not muted
    if (activeId && !isMuted) {
      const activeAudio = audioRefs.current[activeId];
      if (activeAudio) {
        activeAudio.muted = false;
        activeAudio.play().catch(() => {});
      }
    }
  }, [activeId, isMuted]);

  // Trigger animation for first post on mount
  useEffect(() => {
    if (posts.length > 0 && posts[0]?.id) {
      const timer = setTimeout(() => {
        setAnimatedPosts((prevSet) => new Set(prevSet).add(posts[0].id));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []); // Run only once on mount

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.dataset.postId;
          if (!id) return;
          ratiosRef.current.set(id, entry.intersectionRatio);
        });

        let maxId = null;
        let maxRatio = 0;
        ratiosRef.current.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            maxId = id;
          }
        });

        const nextActive = maxRatio >= 0.2 ? maxId : null;
        setActiveId((prev) => {
          if (prev !== nextActive && nextActive) {
            // Trigger animation for newly active post
            setTimeout(() => {
              setAnimatedPosts((prevSet) => new Set(prevSet).add(nextActive));
            }, 50);
          }
          return prev === nextActive ? prev : nextActive;
        });
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], root: containerRef.current }
    );

    Object.values(postRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [posts]);

  if (!posts.length) {
    return (
      <div className="paper-panel-strong flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-[2rem] px-6 py-12 text-center shadow-[0_24px_80px_rgba(124,82,60,0.12)]">
        <p className="font-[var(--font-playfair)] text-3xl text-[var(--foreground)]">
          No poetry here yet
        </p>
        <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">
          New shayari coming soon
        </p>
        <Link
          href="/"
          className="rounded-full bg-[#3c2c24] px-5 py-3 text-sm font-semibold text-white"
        >
          Back Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-20 z-40 mx-auto mb-8 flex w-full max-w-[1080px] flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          {category && (
            <>
              <Link
                href="/"
                className="group rounded-full border border-white/40 bg-white/95 px-5 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-[0_8px_24px_rgba(124,82,60,0.08)] backdrop-blur-xl transition-all hover:shadow-[0_12px_32px_rgba(124,82,60,0.14)] hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Home
                </span>
              </Link>
              <div
                className="rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.24em] shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
                style={{
                  backgroundColor: category.surface,
                  color: category.accent,
                }}
              >
                {category.name}
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setIsMuted((prev) => {
              const newMuted = !prev;
              
              // If unmuting, play active audio immediately
              if (!newMuted && activeId) {
                const activeAudio = audioRefs.current[activeId];
                if (activeAudio) {
                  activeAudio.muted = false;
                  activeAudio.play().catch(() => {});
                }
              } else {
                // If muting, pause all audio
                Object.values(audioRefs.current).forEach(audio => {
                  if (audio) {
                    audio.pause();
                    audio.muted = true;
                  }
                });
              }
              
              return newMuted;
            });
          }}
          className="group rounded-full border border-white/40 bg-white/95 px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-[0_8px_24px_rgba(124,82,60,0.08)] backdrop-blur-xl transition-all hover:shadow-[0_12px_32px_rgba(124,82,60,0.14)] hover:scale-[1.02]"
        >
          <span className="flex items-center gap-2">
            {isMuted ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                Silent
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                Playing
              </>
            )}
          </span>
        </button>
      </div>

      <div
        ref={containerRef}
        className="no-scrollbar mx-auto h-[74vh] w-full max-w-[1080px] overflow-y-scroll snap-y snap-mandatory rounded-[2.8rem] border border-white/20 bg-gradient-to-b from-transparent to-black/5 shadow-[0_32px_120px_rgba(124,82,60,0.16)] md:h-[80vh]"
      >
        {posts.map((post) => {
          const isActive = activeId === post.id;
          const hasAnimated = animatedPosts.has(post.id);
          
          let PostComponent;
          let postProps;
          
          if (post.type === "image") {
            PostComponent = ImagePost;
            postProps = {
              text: post.text,
              image: post.image,
              downloadHref: post.downloadHref ?? post.image,
              downloadLabel: post.downloadLabel,
              isActive,
              mood: post.mood,
              title: post.title,
            };
          } else if (post.type === "video") {
            PostComponent = VideoPost;
            postProps = {
              text: post.text,
              video: post.video,
              poster: post.poster,
              downloadHref: post.downloadHref ?? post.video ?? post.poster,
              downloadLabel: post.downloadLabel,
              isActive,
              mood: post.mood,
              title: post.title,
            };
          } else {
            PostComponent = TextPost;
            postProps = {
              text: post.text,
              downloadHref: post.audio,
              title: post.title,
              isActive,
              mood: post.mood,
            };
          }
          
          // Determine animation state classes
          let animationClasses;
          if (isActive && !hasAnimated) {
            animationClasses = "opacity-100 scale-100 blur-[4px] translate-y-2";
          } else if (isActive && hasAnimated) {
            animationClasses = "opacity-100 scale-100 blur-0 translate-y-0";
          } else {
            animationClasses = "opacity-100 scale-[0.98]";
          }
          
          return (
            <div
              key={post.id}
              className={`snap-start px-4 py-4 transition-all duration-700 ease-out md:px-5 md:py-5 ${animationClasses}`}
              data-post-id={post.id}
              ref={(el) => {
                if (el) postRefs.current[post.id] = el;
              }}
            >
              <PostComponent {...postProps} />
              
              {/* Hidden audio element for this post */}
              {post.audio && (
                <audio
                  ref={(el) => {
                    if (el) audioRefs.current[post.id] = el;
                  }}
                  loop
                  preload="metadata"
                  muted
                >
                  <source src={post.audio} type="audio/mpeg" />
                </audio>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
