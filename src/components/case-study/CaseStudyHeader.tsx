import Link from "next/link";

/**
 * Accepts the existing "Case Study · Solo · …" kicker and "Name — subtitle"
 * title strings and renders them as a plain meta line and a two-level heading.
 */
export default function CaseStudyHeader({
  kicker,
  title,
  tagline,
}: {
  kicker: string;
  title: string;
  tagline?: string;
}) {
  const tags = kicker
    .split("·")
    .map((t) => t.trim())
    .filter((t) => t && t.toLowerCase() !== "case study");
  const [name, subtitle] = title.split(" — ");

  return (
    <div className="mx-auto max-w-4xl px-5 pt-10 sm:px-8 sm:pt-14">
      <Link href="/#work" className="text-[15px] text-graphite-soft transition-colors hover:text-graphite">
        Back to all work
      </Link>
      <p className="mt-10 text-[15px] text-graphite-soft">
        {tags
          .map((t, i) => (i === 0 ? t : t.split(" ").map((w) => (/[A-Z].*[A-Z]/.test(w) ? w : w.toLowerCase())).join(" ")))
          .join(", ")}
      </p>
      <h1 className="mt-5 text-[40px] leading-[1.02] font-semibold tracking-[-0.035em] text-graphite sm:text-[60px]">
        {name}
      </h1>
      {subtitle ? (
        <p className="mt-3 text-[22px] leading-snug tracking-[-0.015em] text-graphite-soft sm:text-[26px]">
          {subtitle.charAt(0).toUpperCase() + subtitle.slice(1)}
        </p>
      ) : null}
      {tagline ? <p className="mt-4 max-w-[60ch] text-lg leading-[1.6] text-graphite-soft">{tagline}</p> : null}
    </div>
  );
}
