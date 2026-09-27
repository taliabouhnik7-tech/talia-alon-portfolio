import HeroMark from "@/components/HeroMark";

export default function Hero() {
  return (
    <section id="top" className="bg-brand">
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-20 sm:px-8 sm:pt-20 sm:pb-28">
        <div className="max-w-3xl">
          <HeroMark className="mb-8 h-14 w-auto text-brand-glow sm:h-16" />
          <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-brand-ink sm:text-5xl md:text-6xl">
            Design decisions you can trace, all the way to production.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink/75 sm:text-xl">
            UX/UI designer with a background in cognitive science. I research,
            design — and when it matters, I take the thing all the way to a
            live product myself.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#work"
              className="inline-flex items-center justify-center rounded-sm bg-brand-glow px-6 py-3 text-sm font-semibold text-brand transition-colors hover:brightness-110"
            >
              See selected work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-sm border border-brand-ink/30 px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-glow hover:text-brand-glow"
            >
              Get in touch
            </a>
          </div>
          <p className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium uppercase tracking-[0.1em] text-brand-ink/60">
            <span>Based in Hadera, Israel</span>
            <span className="text-brand-glow">·</span>
            <span>Open to UX/UI roles</span>
            <span className="text-brand-glow">·</span>
            <span>Figma</span>
            <span className="text-brand-glow">·</span>
            <span>Design Systems</span>
            <span className="text-brand-glow">·</span>
            <span>RTL</span>
            <span className="text-brand-glow">·</span>
            <span>Mobile-first</span>
          </p>
        </div>
      </div>
    </section>
  );
}
