/*
 * A presentation shown the way people read it: one continuous scroll, every
 * page at full resolution, nothing to click through.
 */
type Slide = { src: string; alt: string };

export default function SlideStack({ slides, width = 1400, height = 788 }: { slides: Slide[]; width?: number; height?: number }) {
  return (
    <ol className="space-y-3 sm:space-y-4">
      {slides.map((s, i) => (
        <li key={s.src} className="overflow-hidden rounded-[10px] bg-[#f3f3f3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.src}
            alt={s.alt}
            width={width}
            height={height}
            loading={i < 2 ? "eager" : "lazy"}
            decoding="async"
            className="block h-auto w-full"
          />
        </li>
      ))}
    </ol>
  );
}
