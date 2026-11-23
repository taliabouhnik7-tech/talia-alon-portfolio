/*
 * Real screens from the design file, shown side by side at their true
 * proportions, each with a short caption saying what it does.
 */
type Screen = { src: string; alt: string; caption: string; width?: number; height?: number };

export default function ScreenRow({ screens, cols = 3 }: { screens: Screen[]; cols?: 2 | 3 }) {
  return (
    <ul className={`grid grid-cols-2 gap-x-4 gap-y-8 ${cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
      {screens.map((s) => (
        <li key={s.src}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.src}
            alt={s.alt}
            width={s.width ?? 804}
            height={s.height ?? 1748}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full rounded-[14px] ring-1 ring-rule"
          />
          <p className="mt-3 text-[15px] leading-[1.5] text-graphite-soft">{s.caption}</p>
        </li>
      ))}
    </ul>
  );
}
