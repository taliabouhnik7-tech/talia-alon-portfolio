import Link from "next/link";
import Kicker from "@/components/Kicker";
import Reveal from "@/components/Reveal";

export default function CaseStudyHeader({
  kicker,
  title,
  tagline,
}: {
  kicker: string;
  title: string;
  tagline?: string;
}) {
  return (
    <div className="mx-auto max-w-4xl px-5 pt-10 sm:px-8 sm:pt-14">
      <Link
        href="/#work"
        className="text-sm font-medium text-ink-secondary transition-colors hover:text-accent"
      >
        ← Back to work
      </Link>
      <Reveal className="mt-6">
        <Kicker>{kicker}</Kicker>
        <h1 className="font-serif text-3xl text-ink sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {tagline ? (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-secondary">
            {tagline}
          </p>
        ) : null}
      </Reveal>
    </div>
  );
}
