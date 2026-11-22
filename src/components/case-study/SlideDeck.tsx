"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Slide = { src: string; alt: string };

/**
 * An in-page presentation viewer: one slide at a time, arrows, keyboard,
 * swipe and a thumbnail strip, so a deck reads like a deck without leaving
 * the site.
 */
export default function SlideDeck({ slides, title }: { slides: Slide[]; title: string }) {
  const [i, setI] = useState(0);
  const touch = useRef<number | null>(null);
  const strip = useRef<HTMLDivElement>(null);
  const go = useCallback((n: number) => setI(Math.max(0, Math.min(slides.length - 1, n))), [slides.length]);

  useEffect(() => {
    strip.current?.querySelector<HTMLElement>(`[data-i="${i}"]`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [i]);

  return (
    <div
      className="overflow-hidden rounded-[12px] bg-[#e6e6e6] ring-1 ring-rule"
      role="region"
      aria-roledescription="carousel"
      aria-label={title}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
        touch.current = null;
      }}
    >
      <div className="group relative aspect-[1400/788] w-full">
        {slides.map((s, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            loading={k < 2 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${k === i ? "opacity-100" : "opacity-0"}`}
            aria-hidden={k !== i}
          />
        ))}
        <button
          onClick={() => go(i - 1)}
          disabled={i === 0}
          aria-label="Previous slide"
          className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-graphite shadow-sm ring-1 ring-black/5 transition-opacity hover:bg-white disabled:opacity-0"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button
          onClick={() => go(i + 1)}
          disabled={i === slides.length - 1}
          aria-label="Next slide"
          className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-graphite shadow-sm ring-1 ring-black/5 transition-opacity hover:bg-white disabled:opacity-0"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div className="flex items-center gap-4 border-t border-rule bg-white px-3 py-2.5">
        <span className="shrink-0 pl-1 text-[14px] text-graphite-soft tabular-nums" aria-live="polite">
          {i + 1} / {slides.length}
        </span>
        <div ref={strip} className="flex flex-1 gap-2 overflow-x-auto py-1 [scrollbar-width:none]">
          {slides.map((s, k) => (
            <button
              key={s.src}
              data-i={k}
              onClick={() => go(k)}
              aria-label={`Go to slide ${k + 1}: ${s.alt}`}
              aria-current={k === i}
              className={`relative h-10 w-[71px] shrink-0 overflow-hidden rounded-[4px] bg-[#e6e6e6] ring-offset-1 transition ${k === i ? "ring-2 ring-select" : "opacity-60 ring-1 ring-rule hover:opacity-100"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
